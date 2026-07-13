"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/**
 * A fixed vertical FOV crops the subject on portrait/narrow viewports
 * (horizontal FOV shrinks with aspect). This keeps horizontal framing
 * constant by widening the vertical FOV as the viewport narrows, so the
 * cap stays fully in view on phones instead of being cropped at the edges.
 */
export function ResponsiveFov({ baseFov = 26, baseAspect = 1.7 }: { baseFov?: number; baseAspect?: number }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const baseFovRad = (baseFov * Math.PI) / 180;
    const targetHFovRad = 2 * Math.atan(Math.tan(baseFovRad / 2) * baseAspect);
    const effectiveAspect = Math.min(aspect, baseAspect);
    const newVFovRad = 2 * Math.atan(Math.tan(targetHFovRad / 2) / effectiveAspect);
    cam.fov = (newVFovRad * 180) / Math.PI;
    cam.updateProjectionMatrix();
  }, [camera, size, baseFov, baseAspect]);

  return null;
}

/**
 * A procedural stand-in for the cap — no scanned/photographed product
 * exists yet, so this is built from primitive geometry (hemisphere crown,
 * extruded brim, patch, buckle) rather than faked as a realistic asset.
 * `explode` (0–1) separates every part along its own axis for the
 * disassembly storytelling section; the hero uses it at 0.
 */
function useLeatherShape() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.62, 0);
    shape.quadraticCurveTo(-0.62, 0.34, 0, 0.4);
    shape.quadraticCurveTo(0.62, 0.34, 0.62, 0);
    shape.quadraticCurveTo(0.62, -0.22, 0, -0.3);
    shape.quadraticCurveTo(-0.62, -0.22, -0.62, 0);
    return shape;
  }, []);
}

function usePatchShape() {
  return useMemo(() => {
    const s = new THREE.Shape();
    const w = 0.2;
    const h = 0.15;
    const r = 0.03;
    s.moveTo(-w + r, -h);
    s.lineTo(w - r, -h);
    s.quadraticCurveTo(w, -h, w, -h + r);
    s.lineTo(w, h - r);
    s.quadraticCurveTo(w, h, w - r, h);
    s.lineTo(-w + r, h);
    s.quadraticCurveTo(-w, h, -w, h - r);
    s.lineTo(-w, -h + r);
    s.quadraticCurveTo(-w, -h, -w + r, -h);
    return s;
  }, []);
}

export function CapModel({
  explode = 0,
  autoRotate = true,
  rotationSpeed = 0.12,
  scale = 1,
}: {
  explode?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const brimShape = useLeatherShape();
  const patchShape = usePatchShape();

  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * rotationSpeed;
    }
  });

  const extrude = { depth: 0.05, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 3 };
  const patchExtrude = { depth: 0.025, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2 };

  return (
    <group ref={group} scale={scale}>
      {/* Crown */}
      <mesh position={[0, 0.08 + explode * 0.55, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.02, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
        <meshPhysicalMaterial
          color="#ddccb0"
          roughness={0.88}
          sheen={1}
          sheenRoughness={0.75}
          sheenColor={new THREE.Color("#f3e9d4")}
          clearcoat={0}
        />
      </mesh>

      {/* Crown button, seated at the apex of the dome */}
      <mesh position={[0, 1.06 + explode * 1.1, 0]} castShadow>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshPhysicalMaterial color="#ddccb0" roughness={0.85} sheen={1} sheenColor={new THREE.Color("#f3e9d4")} />
      </mesh>

      {/* Brim — laid flat (rotated 90° off the shape's drawing plane) and
          drooped slightly at the front tip, like a real visor. */}
      <group position={[0, -0.13 - explode * 0.65, 0.95 + explode * 0.95]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[brimShape, extrude]} />
          <meshPhysicalMaterial color="#a9835a" roughness={0.55} clearcoat={0.18} clearcoatRoughness={0.4} />
        </mesh>
      </group>

      {/* Front patch — held just proud of the crown surface, above the brim line */}
      <group position={[0, 0.28 - explode * 0.15, 1.06 + explode * 1.2]} rotation={[-0.12, 0, 0]}>
        <mesh castShadow>
          <extrudeGeometry args={[patchShape, patchExtrude]} />
          <meshPhysicalMaterial color="#8a5a34" roughness={0.5} clearcoat={0.2} clearcoatRoughness={0.35} />
        </mesh>
      </group>

      {/* Back strap / buckle cluster */}
      <group position={[0, -0.1 + explode * 0.1, -1.0 - explode * 1.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.16, 0.03]} />
          <meshPhysicalMaterial color="#a9835a" roughness={0.55} clearcoat={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[0.09, 0.014, 12, 24]} />
          <meshStandardMaterial color="#b7b0a6" metalness={0.9} roughness={0.35} />
        </mesh>
      </group>

      {/* Eyelets — seated on the crown surface, pushed outward when exploded */}
      {[-0.86, 0.86].map((x) => (
        <mesh
          key={x}
          position={[x + Math.sign(x) * explode * 0.4, 0.5 + explode * 0.3, 0.35]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.045, 0.01, 8, 16]} />
          <meshStandardMaterial color="#b7b0a6" metalness={0.85} roughness={0.4} />
        </mesh>
      ))}

      {/* Grounding shadow — omitted when parts are exploded apart */}
      {explode < 0.05 && (
        <ContactShadows position={[0, -0.95, 0]} opacity={0.35} scale={4} blur={2.4} far={2} color="#3a2f20" />
      )}
    </group>
  );
}

/** Procedural, self-contained studio lighting — no external HDRI fetch. */
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff3df" />
      <directionalLight position={[3, 4, 2]} intensity={1.1} color="#fff0d8" castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#dfe8ee" />
      <pointLight position={[0, 3, -3]} intensity={0.4} color="#e8c98a" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[3, 3, 2]} scale={[3, 3, 1]} color="#fff6e8" />
        <Lightformer form="rect" intensity={1} position={[-3, 2, -2]} scale={[3, 3, 1]} color="#e9f0f2" />
        <Lightformer form="ring" intensity={0.5} position={[0, 4, 0]} scale={4} color="#f3e6c9" />
      </Environment>
    </>
  );
}
