"use client";

import { useEffect, useRef, useState } from "react";

const TEAL = 0x00c2d1;
const VIOLET = 0x8b5cf6;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

// Same radial gradient serves three roles: WebGL loading backdrop, the
// permanent no-WebGL fallback, and the mobile poster — one visual, no
// separate image asset to source or ship.
function GlowFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-full blur-2xl"
      style={{
        background:
          "radial-gradient(circle at 35% 30%, rgba(0,194,209,0.35), transparent 60%), radial-gradient(circle at 65% 70%, rgba(139,92,246,0.3), transparent 60%)",
      }}
    />
  );
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  // Lazy initializer, not an effect: this component only ever mounts
  // client-side (loaded via dynamic(..., { ssr: false })), so `window`
  // is always available here — no need to defer the check to an effect.
  const [mountCanvas] = useState(
    () => !window.matchMedia("(max-width: 767px)").matches && hasWebGL(),
  );

  useEffect(() => {
    if (!mountCanvas) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    import("three").then((THREE) => {
      if (cancelled || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // Low-poly faceted gem — 0 subdivisions keeps it flat-shaded and cheap
      // (20 triangles), no texture needed.
      const geometry = new THREE.IcosahedronGeometry(1.3, 0);
      const material = new THREE.MeshStandardMaterial({
        color: TEAL,
        flatShading: true,
        roughness: 0.35,
        metalness: 0.1,
      });
      const gem = new THREE.Mesh(geometry, material);
      scene.add(gem);

      const tealLight = new THREE.PointLight(TEAL, 8, 10);
      tealLight.position.set(2, 2, 3);
      const violetLight = new THREE.PointLight(VIOLET, 10, 10);
      violetLight.position.set(-2, -1, 2);
      scene.add(tealLight, violetLight, new THREE.AmbientLight(0xffffff, 0.15));

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let animationId: number | null = null;

      if (prefersReducedMotion) {
        gem.rotation.set(0.4, 0.6, 0);
        renderer.render(scene, camera);
      } else {
        const animate = () => {
          // ~25s per revolution — slow, ambient, not attention-grabbing.
          gem.rotation.y += 0.0018;
          gem.rotation.x += 0.0007;
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        };
        animate();
      }

      cleanupRef.current = () => {
        if (animationId !== null) cancelAnimationFrame(animationId);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [mountCanvas]);

  return (
    <div className="relative h-64 w-64 sm:h-80 sm:w-80" aria-hidden="true">
      <GlowFallback />
      {mountCanvas && <div ref={containerRef} className="absolute inset-0" />}
    </div>
  );
}
