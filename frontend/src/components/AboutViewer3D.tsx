"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type CriteriaType = "cost" | "benefit";

type AlternativePoint = {
  name: string;
  values: [number, number, number];
  dPlus: number;
  dMinus: number;
  cc: number;
};

type Topsis3DResult = {
  alternatives: AlternativePoint[];
  pis: [number, number, number];
  nis: [number, number, number];
  winnerName: string;
};

const COLORS = {
  pis: "#378ADD",
  nis: "#D85A30",
  alternative: "#1D9E75",
};

function createLabelSprite(text: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create label context");
  }

  ctx.clearRect(0, 0, 128, 48);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.roundRect(4, 4, 120, 40, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 24);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.8, 0.7, 1);
  sprite.renderOrder = 999;
  return sprite;
}

function computeTopsis3D(): Topsis3DResult {
  const matrix: [number, number, number][] = [
    [12000, 8.0, 20],
    [10500, 7.2, 17],
    [11300, 9.1, 23],
  ];
  const names = ["A", "B", "C"];
  const weights: [number, number, number] = [0.4, 0.35, 0.25];
  const types: [CriteriaType, CriteriaType, CriteriaType] = ["cost", "benefit", "cost"];

  const columns = [0, 1, 2] as const;

  const norms = columns.map((j) => {
    const sumSquares = matrix.reduce((acc, row) => acc + row[j] * row[j], 0);
    return Math.sqrt(sumSquares);
  }) as [number, number, number];

  const normalized = matrix.map((row) =>
    columns.map((j) => row[j] / norms[j]) as [number, number, number],
  );

  const weighted = normalized.map((row) =>
    columns.map((j) => row[j] * weights[j]) as [number, number, number],
  );

  const pis = columns.map((j) => {
    const values = weighted.map((row) => row[j]);
    return types[j] === "cost" ? Math.min(...values) : Math.max(...values);
  }) as [number, number, number];

  const nis = columns.map((j) => {
    const values = weighted.map((row) => row[j]);
    return types[j] === "cost" ? Math.max(...values) : Math.min(...values);
  }) as [number, number, number];

  const alternatives = weighted.map((coords, i) => {
    const dPlus = Math.sqrt(
      (coords[0] - pis[0]) ** 2 +
      (coords[1] - pis[1]) ** 2 +
      (coords[2] - pis[2]) ** 2,
    );
    const dMinus = Math.sqrt(
      (coords[0] - nis[0]) ** 2 +
      (coords[1] - nis[1]) ** 2 +
      (coords[2] - nis[2]) ** 2,
    );
    const cc = dMinus / (dPlus + dMinus);
    return {
      name: names[i],
      values: coords,
      dPlus,
      dMinus,
      cc,
    };
  });

  const winnerName = alternatives.reduce((best, current) =>
    current.cc > best.cc ? current : best,
  ).name;

  return { alternatives, pis, nis, winnerName };
}

export default function AboutViewer3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => computeTopsis3D(), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 100);
    camera.position.set(12, 8, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 10, 10);
    scene.add(dir);

    const allCoordsRaw = [
      ...result.alternatives.map((a) => a.values),
      result.pis,
      result.nis,
    ];

    const mins = [0, 1, 2].map((j) => Math.min(...allCoordsRaw.map((p) => p[j])));
    const maxs = [0, 1, 2].map((j) => Math.max(...allCoordsRaw.map((p) => p[j])));
    const ranges = maxs.map((max, j) => max - mins[j] || 1);
    const toScene = (p: [number, number, number]): [number, number, number] => [
      ((p[0] - mins[0]) / ranges[0]) * 10 - 5,
      ((p[1] - mins[1]) / ranges[1]) * 10 - 5,
      ((p[2] - mins[2]) / ranges[2]) * 10 - 5,
    ];

    const pisScene = toScene(result.pis);
    const nisScene = toScene(result.nis);
    const altScene = result.alternatives.map((a) => ({
      ...a,
      scene: toScene(a.values),
    }));

    controls.target.set(0, 0, 0);

    const grid = new THREE.GridHelper(14, 14, 0x7f7f7f, 0xcfcfcf);
    grid.position.set(0, -5.2, 0);
    scene.add(grid);

    const axis = new THREE.AxesHelper(6);
    scene.add(axis);

    const pisVec = new THREE.Vector3(pisScene[0], pisScene[1], pisScene[2]);
    const nisVec = new THREE.Vector3(nisScene[0], nisScene[1], nisScene[2]);

    const pisSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: COLORS.pis }),
    );
    pisSphere.position.copy(pisVec);
    scene.add(pisSphere);

    const nisSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: COLORS.nis }),
    );
    nisSphere.position.copy(nisVec);
    scene.add(nisSphere);

    const pisLabel = createLabelSprite("PIS");
    pisLabel.position.copy(pisVec.clone().add(new THREE.Vector3(0, 0.65, 0)));
    scene.add(pisLabel);

    const nisLabel = createLabelSprite("NIS");
    nisLabel.position.copy(nisVec.clone().add(new THREE.Vector3(0, 0.65, 0)));
    scene.add(nisLabel);

    altScene.forEach((alt) => {
      const altVec = new THREE.Vector3(alt.scene[0], alt.scene[1], alt.scene[2]);

      const altSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 20, 20),
        new THREE.MeshStandardMaterial({ color: COLORS.alternative }),
      );
      altSphere.position.copy(altVec);
      scene.add(altSphere);

      const altLabel = createLabelSprite(alt.name);
      altLabel.position.copy(altVec.clone().add(new THREE.Vector3(0, 0.55, 0)));
      scene.add(altLabel);

      const dPlusGeometry = new THREE.BufferGeometry().setFromPoints([altVec, pisVec]);
      const dPlusLine = new THREE.Line(
        dPlusGeometry,
        new THREE.LineBasicMaterial({ color: COLORS.pis }),
      );
      scene.add(dPlusLine);

      const dMinusGeometry = new THREE.BufferGeometry().setFromPoints([altVec, nisVec]);
      const dMinusLine = new THREE.Line(
        dMinusGeometry,
        new THREE.LineDashedMaterial({ color: COLORS.nis, dashSize: 0.018, gapSize: 0.01 }),
      );
      dMinusLine.computeLineDistances();
      scene.add(dMinusLine);
    });

    const observer = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    observer.observe(container);

    let animationFrameId = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [result]);

  return (
    <div className="relative w-full">
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full border border-gray-200 rounded-xl overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      <aside className="relative mt-3 sm:mt-0 sm:absolute sm:top-3 sm:right-3 sm:w-[220px] w-full bg-[#231F20]/80 border border-white/15 rounded-lg p-3 backdrop-blur-sm">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-white/80 mb-2">
          Métricas TOPSIS
        </p>

        <div className="flex sm:flex-col gap-2 overflow-x-auto">
          {result.alternatives.map((alt) => {
            const isWinner = alt.name === result.winnerName;
            return (
              <div
                key={alt.name}
                className={`min-w-[170px] sm:min-w-0 flex-1 rounded-md p-2 border ${
                  isWinner ? "border-[#DB1E2F] bg-[#DB1E2F]/20" : "border-white/15 bg-white/5"
                }`}
              >
                <p className="text-sm font-semibold text-white mb-1">
                  {alt.name} {isWinner ? "• melhor CC" : ""}
                </p>
                <p className="text-xs text-white/80">D+ = {alt.dPlus.toFixed(3)}</p>
                <p className="text-xs text-white/80">D- = {alt.dMinus.toFixed(3)}</p>
                <p className="text-xs text-white/95 font-semibold">CCi = {alt.cc.toFixed(3)}</p>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
