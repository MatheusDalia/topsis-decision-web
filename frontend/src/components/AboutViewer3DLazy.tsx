"use client";

import dynamic from "next/dynamic";

const AboutViewer3D = dynamic(() => import("./AboutViewer3D"), { ssr: false });

export default function AboutViewer3DLazy() {
  return <AboutViewer3D />;
}
