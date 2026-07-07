"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Beauty-object 3D scene for the hero: five recognisable objects from a
 * salon vanity — a perfume bottle, a lipstick, a nail polish bottle, a
 * serum drop and a mirror ring — modelled from primitives (no external
 * assets to fetch) and drifting gently in depth. Replaces the previous
 * generic abstract ring field: every shape here should read instantly as
 * "beauty", not as decoration borrowed from any dashboard template.
 */

function PerfumeBottle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.18;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={0.62}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 1, 8]} />
        <meshPhysicalMaterial
          color="#D9CBB0"
          transmission={0.85}
          roughness={0.08}
          thickness={0.6}
          ior={1.4}
        />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.28, 8]} />
        <meshStandardMaterial color="#B79355" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 8]} />
        <meshStandardMaterial color="#17140F" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Lipstick({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[2]) * 0.16;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
  });
  return (
    <group ref={ref} position={position} rotation={[0, 0, 0.35]} scale={0.55}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
        <meshStandardMaterial color="#17140F" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#A6584A" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.16, 0.28, 16]} />
        <meshStandardMaterial color="#8B4438" roughness={0.3} />
      </mesh>
    </group>
  );
}

function NailPolish({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.45 + position[1]) * 0.15;
    ref.current.rotation.y = -state.clock.elapsedTime * 0.2;
  });
  return (
    <group ref={ref} position={position} scale={0.6}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color="#5C6A74"
          transmission={0.6}
          roughness={0.1}
          thickness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.34, 12]} />
        <meshStandardMaterial color="#17140F" roughness={0.5} />
      </mesh>
    </group>
  );
}

function SerumDrop({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0] * 2) * 0.22;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
  });
  return (
    <mesh ref={ref} position={position} scale={0.4}>
      <sphereGeometry args={[0.5, 24, 24]} />
      <meshPhysicalMaterial
        color="#D4B87B"
        transmission={0.95}
        roughness={0.02}
        thickness={0.8}
        ior={1.3}
      />
    </mesh>
  );
}

function MirrorRing({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.18;
    ref.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.35) * 0.14;
  });
  return (
    <mesh ref={ref} position={position} scale={0.75}>
      <torusGeometry args={[0.55, 0.05, 16, 48]} />
      <meshStandardMaterial color="#B79355" metalness={0.85} roughness={0.15} />
    </mesh>
  );
}

function Scene() {
  const light = useRef<THREE.DirectionalLight>(null);

  const layout = useMemo(
    () => ({
      perfume: [-2.6, 0.6, -1] as [number, number, number],
      lipstick: [2.3, -0.5, -0.5] as [number, number, number],
      nailPolish: [-1.8, -1.2, -2] as [number, number, number],
      serum: [1.6, 1.3, -1.5] as [number, number, number],
      mirror: [2.8, 1.4, -2.5] as [number, number, number],
    }),
    []
  );

  return (
    <>
      <ambientLight intensity={0.65} color="#F6EFE4" />
      <directionalLight ref={light} position={[3, 4, 5]} intensity={1.1} color="#FFFBF3" />
      <directionalLight position={[-4, -2, 2]} intensity={0.35} color="#B79355" />
      <PerfumeBottle position={layout.perfume} />
      <Lipstick position={layout.lipstick} />
      <NailPolish position={layout.nailPolish} />
      <SerumDrop position={layout.serum} />
      <MirrorRing position={layout.mirror} />
    </>
  );
}

export function BeautyScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      className="!absolute inset-0"
    >
      <Scene />
    </Canvas>
  );
}
