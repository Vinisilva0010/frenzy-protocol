"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 200);
    camera.position.z = 28;

    const TOTAL = isMobile ? 600 : 1200;

    // Posições destino: grid retangular representando FRENZY
    const logoPositions: number[] = [];
    const cols = isMobile ? 30 : 60;
    const rows = isMobile ? 10 : 20;

    for (let i = 0; i < TOTAL; i++) {
      const col = (i % cols) / cols;
      const row = Math.floor(i / cols) / rows;
      logoPositions.push(
        (col - 0.5) * 30,
        (0.5 - row) * 8,
        (((i * 7919) % 100) / 100 - 0.5) * 2 // pseudo-random estático por seed
      );
    }

    // Posições de caos: determinísticas por índice, zero Math.random no loop
    const chaosPositions: number[] = [];
    for (let i = 0; i < TOTAL; i++) {
      // Pseudo-random estático usando primos para distribuição uniforme
      const px = (((i * 2654435761) >>> 0) % 10000) / 10000;
      const py = (((i * 2246822519) >>> 0) % 10000) / 10000;
      const pz = (((i * 3266489917) >>> 0) % 10000) / 10000;
      chaosPositions.push(
        (px - 0.5) * 60,
        (py - 0.5) * 40,
        (pz - 0.5) * 20
      );
    }

    const posArray = new Float32Array(TOTAL * 3);
    const colorArray = new Float32Array(TOTAL * 3);

    const colors = [
      new THREE.Color("#14F195"),
      new THREE.Color("#9945FF"),
      new THREE.Color("#00E1FD"),
      new THREE.Color("#FF00FF"),
    ];

    for (let i = 0; i < TOTAL; i++) {
      posArray[i * 3]     = chaosPositions[i * 3];
      posArray[i * 3 + 1] = chaosPositions[i * 3 + 1];
      posArray[i * 3 + 2] = chaosPositions[i * 3 + 2];
      const c = colors[i % colors.length];
      colorArray[i * 3]     = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.18 : 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    type Phase = "gathering" | "hold" | "exploding" | "chaos";
    let phase: Phase = "gathering";
    let phaseTimer = 0;
    const GATHER_DURATION  = 120;
    const HOLD_DURATION    = 80;
    const EXPLODE_DURATION = 90;
    const CHAOS_DURATION   = 60;

    // Offsets determinísticos para drift no chaos — calculados uma vez
    const driftX = new Float32Array(TOTAL);
    const driftY = new Float32Array(TOTAL);
    for (let i = 0; i < TOTAL; i++) {
      // Frequência e fase únicas por partícula, sem Math.random no loop
      driftX[i] = (((i * 1664525) >>> 0) % 1000) / 1000; // fase seno 0..1
      driftY[i] = (((i * 1013904223) >>> 0) % 1000) / 1000;
    }

    let visible = true;
    const onVis = () => { visible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    const positions = geometry.attributes.position;
    let animId: number;
    let globalTick = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!visible) return;

      phaseTimer++;
      globalTick++;

      if (phase === "gathering") {
        const t = Math.min(phaseTimer / GATHER_DURATION, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        for (let i = 0; i < TOTAL; i++) {
          positions.setX(i, chaosPositions[i * 3]     + (logoPositions[i * 3]     - chaosPositions[i * 3])     * ease);
          positions.setY(i, chaosPositions[i * 3 + 1] + (logoPositions[i * 3 + 1] - chaosPositions[i * 3 + 1]) * ease);
          positions.setZ(i, chaosPositions[i * 3 + 2] + (logoPositions[i * 3 + 2] - chaosPositions[i * 3 + 2]) * ease);
        }
        if (phaseTimer >= GATHER_DURATION) { phase = "hold"; phaseTimer = 0; }

      } else if (phase === "hold") {
        if (phaseTimer >= HOLD_DURATION) { phase = "exploding"; phaseTimer = 0; }

      } else if (phase === "exploding") {
        const t = Math.min(phaseTimer / EXPLODE_DURATION, 1);
        const ease = t * t * t;
        for (let i = 0; i < TOTAL; i++) {
          positions.setX(i, logoPositions[i * 3]     + (chaosPositions[i * 3]     - logoPositions[i * 3])     * ease);
          positions.setY(i, logoPositions[i * 3 + 1] + (chaosPositions[i * 3 + 1] - logoPositions[i * 3 + 1]) * ease);
          positions.setZ(i, logoPositions[i * 3 + 2] + (chaosPositions[i * 3 + 2] - logoPositions[i * 3 + 2]) * ease);
        }
        if (phaseTimer >= EXPLODE_DURATION) { phase = "chaos"; phaseTimer = 0; }

      } else if (phase === "chaos") {
        // Drift determinístico: seno/cosseno por índice, zero Math.random
        const t = globalTick * 0.015;
        for (let i = 0; i < TOTAL; i++) {
          const ox = Math.sin(t + driftX[i] * Math.PI * 2) * 0.04;
          const oy = Math.cos(t + driftY[i] * Math.PI * 2) * 0.04;
          positions.setX(i, positions.getX(i) + ox);
          positions.setY(i, positions.getY(i) + oy);
        }
        if (phaseTimer >= CHAOS_DURATION) { phase = "gathering"; phaseTimer = 0; }
      }

      positions.needsUpdate = true;
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}