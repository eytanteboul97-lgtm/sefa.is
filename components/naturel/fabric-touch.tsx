"use client";

import { useMemo, useRef } from "react";
import { Canvas, extend, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const FabricMaterial = shaderMaterial(
  {
    uMouse: new THREE.Vector2(0.5, 0.5),
    uHover: 0,
    uTime: 0,
  },
  /* vertex */ `
    uniform vec2 uMouse;
    uniform float uHover;
    uniform float uTime;
    varying vec2 vUv;
    varying float vLift;

    void main() {
      vUv = uv;
      vec3 pos = position;

      float dist = distance(uv, uMouse);
      float falloff = smoothstep(0.42, 0.0, dist);
      float lift = falloff * 0.22 * uHover;

      float ambient = sin(uv.x * 6.0 + uTime * 0.5) * cos(uv.y * 5.0 + uTime * 0.4) * 0.008;

      pos.z += lift + ambient;
      vLift = lift;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* fragment */ `
    varying vec2 vUv;
    varying float vLift;

    void main() {
      vec3 base = mix(vec3(0.851, 0.780, 0.663), vec3(0.925, 0.882, 0.792), vUv.y);

      float weave = sin((vUv.x + vUv.y) * 220.0) * 0.02 + sin((vUv.x - vUv.y) * 220.0) * 0.02;
      base += weave;

      vec3 highlight = vec3(1.0, 0.97, 0.9) * vLift * 1.8;

      gl_FragColor = vec4(base + highlight, 1.0);
    }
  `
);

extend({ FabricMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fabricMaterial: any;
  }
}

function FabricPlane() {
  const materialRef = useRef<any>(null);
  const hover = useRef(0);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uHover = THREE.MathUtils.damp(materialRef.current.uHover ?? 0, hover.current, 4, delta);
  });

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    if (!materialRef.current || !e.uv) return;
    materialRef.current.uMouse.lerp(e.uv, 0.35);
    hover.current = 1;
  };

  return (
    <mesh
      onPointerMove={handleMove}
      onPointerLeave={() => {
        hover.current = 0;
      }}
    >
      <planeGeometry args={[4.2, 2.6, 160, 100]} />
      <fabricMaterial ref={materialRef} />
    </mesh>
  );
}

/**
 * The one place visitors can "touch" the material: a woven-cotton plane
 * that lifts gently beneath the cursor, like a warm breeze passing under
 * fabric. Procedural GLSL — no fabric texture asset exists to sample.
 */
export function FabricTouch() {
  const memoizedNote = useMemo(
    () => "Move your cursor across the weave.",
    []
  );

  return (
    <section className="naturel-grain relative flex min-h-[80vh] w-full flex-col items-center justify-center gap-8 bg-naturel-linen py-24">
      <div className="text-center">
        <span className="naturel-display text-[11px] uppercase tracking-[0.35em] text-naturel-ink/45">Touch</span>
        <h2 className="naturel-serif mt-3 text-3xl text-naturel-ink sm:text-4xl">The weight of cotton.</h2>
        <p className="naturel-accent mt-2 text-sm text-naturel-ink/50">{memoizedNote}</p>
      </div>

      <div className="h-[42vh] w-full max-w-3xl px-6">
        <Canvas camera={{ position: [0, 0, 3.4], fov: 34 }} dpr={[1, 1.75]}>
          <ambientLight intensity={0.9} color="#fff6e6" />
          <directionalLight position={[2, 2, 3]} intensity={0.6} color="#fff0d8" />
          <FabricPlane />
        </Canvas>
      </div>
    </section>
  );
}
