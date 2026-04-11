"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VaultCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 5.5;

    // Luz ambiente + direcional para dar profundidade nas faces
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x14F195, 1.2);
    dirLight.position.set(3, 3, 5);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x9945FF, 0.8);
    dirLight2.position.set(-3, -2, 3);
    scene.add(dirLight2);

    // Carrega as 6 texturas na ordem do BoxGeometry:
    // right(+x), left(-x), top(+y), bottom(-y), front(+z), back(-z)
    const loader = new THREE.TextureLoader();
    const texturePaths = [
      "/vault-right.png",
      "/vault-left.png",
      "/vault-top.png",
      "/vault-bottom.png",
      "/vault-front.png",
      "/vault-back.png",
    ];

    const materials = texturePaths.map((path) => {
      const tex = loader.load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.4,
        metalness: 0.6,
      });
    });

    const geometry = new THREE.BoxGeometry(2.8, 2.8, 2.8);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Glow — wireframe por cima do cubo
    const wireGeo = new THREE.BoxGeometry(2.95, 2.95, 2.95);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#14F195"),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireCube = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireCube);

    // Mouse tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Rotação base inicial para mostrar a face frontal levemente girada
    cube.rotation.x = 0.3;
    cube.rotation.y = -0.4;
    wireCube.rotation.x = 0.3;
    wireCube.rotation.y = -0.4;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientX - cx) / (rect.width / 2)) * 0.5;
      targetY = -((e.clientY - cy) / (rect.height / 2)) * 0.5;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = mount.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((touch.clientX - cx) / (rect.width / 2)) * 0.3;
      targetY = -((touch.clientY - cy) / (rect.height / 2)) * 0.3;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Breathing agressivo
    let clock = 0;
    let visible = true;
    const onVis = () => { visible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!visible) return;

      clock += 0.02;

      // Lerp suave do mouse
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Rotação base + mouse
      cube.rotation.y = -0.4 + currentX;
      cube.rotation.x = 0.3 + currentY;
      wireCube.rotation.y = cube.rotation.y;
      wireCube.rotation.x = cube.rotation.x;

      // Breathing: cresce forte e rápido, desce devagar
      // sin vai de -1 a 1, usamos só a parte positiva com power para subir rápido
      const raw = Math.sin(clock);
      const breath = Math.pow(Math.max(raw, 0), 0.5);
      const scale = 1 + breath * 0.12;
      cube.scale.set(scale, scale, scale);
      wireCube.scale.set(scale * 1.02, scale * 1.02, scale * 1.02);

      // Glow wireframe pulsa mais forte no pico
      wireMat.opacity = 0.1 + breath * 0.3;

      // Luz direcional pulsa junto
      dirLight.intensity = 1.0 + breath * 0.8;

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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}