"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { TopsisProjectionResponse } from "@/lib/api";

type Props = {
  data: TopsisProjectionResponse;
};

const COLORS = {
  alternative: 0x1d9e75,
  pis: 0x378add,
  nis: 0xd85a30,
  dPlusLine: 0x378add,
  dMinusLine: 0xd85a30,
};

function createLabelSprite(text: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 96;

  if (context) {
    context.fillStyle = "rgba(20, 20, 20, 0.75)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.font = "bold 30px Nunito Sans, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.35, 0.13, 1);
  return sprite;
}

function normalizePoints(data: TopsisProjectionResponse) {
  const extent = data.points.reduce((max, point) => {
    return Math.max(max, Math.abs(point.x), Math.abs(point.y), Math.abs(point.z));
  }, 1);
  const safeExtent = extent === 0 ? 1 : extent;
  return data.points.map((point) => ({
    ...point,
    x: point.x / safeExtent,
    y: point.y / safeExtent,
    z: point.z / safeExtent,
  }));
}

export default function Topsis3DViewer({ data }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const normalized = useMemo(() => normalizePoints(data), [data]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100,
    );
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 1.0);
    directional.position.set(3, 5, 6);
    scene.add(directional);

    const grid = new THREE.GridHelper(4, 8, 0xd1d5db, 0xe5e7eb);
    grid.position.y = -1.35;
    rootGroup.add(grid);

    const axis = new THREE.AxesHelper(1.2);
    rootGroup.add(axis);

    const byId = new Map<string, THREE.Vector3>();

    normalized.forEach((point) => {
      const radius = point.type === "alternative" ? 0.06 : 0.09;
      const geometry = new THREE.SphereGeometry(radius, 28, 28);
      const material = new THREE.MeshStandardMaterial({
        color:
          point.type === "pis"
            ? COLORS.pis
            : point.type === "nis"
              ? COLORS.nis
              : COLORS.alternative,
        roughness: 0.35,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(point.x, point.y, point.z);
      rootGroup.add(mesh);
      byId.set(point.id, new THREE.Vector3(point.x, point.y, point.z));

      const label = createLabelSprite(point.label);
      label.position.set(point.x, point.y + 0.12, point.z);
      rootGroup.add(label);
    });

    const pis = normalized.find((point) => point.type === "pis");
    const nis = normalized.find((point) => point.type === "nis");

    normalized
      .filter((point) => point.type === "alternative")
      .forEach((point) => {
        if (pis) {
          const dPlusGeometry = new THREE.BufferGeometry().setFromPoints([
            byId.get(point.id) as THREE.Vector3,
            byId.get(pis.id) as THREE.Vector3,
          ]);
          const dPlusLine = new THREE.Line(
            dPlusGeometry,
            new THREE.LineBasicMaterial({ color: COLORS.dPlusLine }),
          );
          rootGroup.add(dPlusLine);
        }

        if (nis) {
          const dMinusGeometry = new THREE.BufferGeometry().setFromPoints([
            byId.get(point.id) as THREE.Vector3,
            byId.get(nis.id) as THREE.Vector3,
          ]);
          const dMinusLine = new THREE.Line(
            dMinusGeometry,
            new THREE.LineDashedMaterial({
              color: COLORS.dMinusLine,
              dashSize: 0.07,
              gapSize: 0.05,
            }),
          );
          dMinusLine.computeLineDistances();
          rootGroup.add(dMinusLine);
        }
      });

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let cameraDistance = camera.position.length();

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      rootGroup.rotation.y += deltaX * 0.007;
      rootGroup.rotation.x += deltaY * 0.007;
      rootGroup.rotation.x = Math.max(-1.2, Math.min(1.2, rootGroup.rotation.x));
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      isDragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraDistance += event.deltaY * 0.002;
      cameraDistance = Math.max(2.2, Math.min(8.5, cameraDistance));
      camera.position.setLength(cameraDistance);
    };

    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    let frame = 0;
    const renderLoop = () => {
      frame = requestAnimationFrame(renderLoop);
      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj instanceof THREE.Sprite) {
          const mat = obj.material as THREE.SpriteMaterial;
          mat.map?.dispose();
          mat.dispose();
        }
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [normalized]);

  const alternatives = normalized.filter((point) => point.type === "alternative");

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
      <h2 className="text-sm font-extrabold text-[#231F20] mb-1">Visualizacao 3D TOPSIS</h2>
      <p className="text-xs text-gray-400 mb-5">Alternativas, PIS e NIS projetados por PCA (3 componentes)</p>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="relative h-[430px] rounded-lg border border-gray-100 overflow-hidden bg-slate-50">
          <div ref={containerRef} className="h-full w-full touch-none" />
          <div className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-1.5 text-xs text-gray-600 border border-gray-200">
            Variancia explicada (3D): {data.variance_explained.toFixed(2)}%
          </div>
        </div>

        <aside className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Metricas por alternativa</h3>
          <div className="space-y-3">
            {alternatives.map((point) => {
              const label = point.label;
              return (
                <div key={point.id} className="rounded-md border border-gray-200 bg-white p-3">
                  <p className="text-sm font-bold text-[#231F20]">{label}</p>
                  <div className="mt-1 space-y-0.5 text-xs font-mono">
                    <p className="text-blue-700">D+: {(data.d_plus[label] ?? 0).toFixed(4)}</p>
                    <p className="text-orange-700">D-: {(data.d_minus[label] ?? 0).toFixed(4)}</p>
                    <p className="text-emerald-700">CCi: {(data.cc[label] ?? 0).toFixed(4)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
