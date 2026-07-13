import * as THREE from "three";

/**
 * No real fabric/leather scan exists and the external CDNs that host
 * free PBR texture sets are unreachable from this environment, so these
 * generate genuine normal + roughness maps from height fields drawn on a
 * canvas — real PBR shading response (light catching individual fibers,
 * leather pores) instead of a flat color reacting to light as one smooth
 * plane. Computed once and cached.
 */

function paintNormalMap(out: Uint8ClampedArray, height: Float32Array, size: number, strength: number) {
  const at = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const n = new THREE.Vector3(-dx, -dy, 1).normalize();
      const i = (y * size + x) * 4;
      out[i] = (n.x * 0.5 + 0.5) * 255;
      out[i + 1] = (n.y * 0.5 + 0.5) * 255;
      out[i + 2] = (n.z * 0.5 + 0.5) * 255;
      out[i + 3] = 255;
    }
  }
}

function makeTexturesFromHeight(height: Float32Array, size: number, normalStrength: number, roughnessBase: number, roughnessRange: number) {
  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = size;
  normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext("2d")!;
  const normalImg = normalCtx.createImageData(size, size);
  paintNormalMap(normalImg.data, height, size, normalStrength);
  normalCtx.putImageData(normalImg, 0, 0);

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext("2d")!;
  const roughImg = roughCtx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = Math.min(1, Math.max(0, height[i]));
    const gray = (roughnessBase + v * roughnessRange) * 255;
    roughImg.data[i * 4] = gray;
    roughImg.data[i * 4 + 1] = gray;
    roughImg.data[i * 4 + 2] = gray;
    roughImg.data[i * 4 + 3] = 255;
  }
  roughCtx.putImageData(roughImg, 0, 0);

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  for (const tex of [normalMap, roughnessMap]) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
  }
  return { normalMap, roughnessMap };
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Woven cotton: fine diagonal twill ridges plus per-fiber irregularity. */
export function makeCottonTextures(size = 256) {
  const height = new Float32Array(size * size);
  const rand = seededRandom(7);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const weaveA = Math.sin((x + y) * 0.35);
      const weaveB = Math.sin((x - y) * 0.35);
      const fiber = (rand() - 0.5) * 0.5;
      height[y * size + x] = 0.5 + weaveA * 0.12 + weaveB * 0.12 + fiber * 0.1;
    }
  }
  const { normalMap, roughnessMap } = makeTexturesFromHeight(height, size, 1.1, 0.72, 0.22);
  normalMap.repeat.set(10, 10);
  roughnessMap.repeat.set(10, 10);
  return { normalMap, roughnessMap };
}

/** Vegetable-tanned leather: soft low-frequency wrinkles + fine pore stipple. */
export function makeLeatherTextures(size = 256) {
  const height = new Float32Array(size * size);
  const rand = seededRandom(19);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const wrinkle =
        Math.sin(x * 0.06 + Math.sin(y * 0.05) * 2) * 0.18 + Math.cos(y * 0.07 + Math.sin(x * 0.04) * 2) * 0.14;
      const pore = rand() > 0.965 ? -(rand() * 0.35) : 0;
      const grain = (rand() - 0.5) * 0.12;
      height[y * size + x] = 0.5 + wrinkle + pore + grain;
    }
  }
  const { normalMap, roughnessMap } = makeTexturesFromHeight(height, size, 0.9, 0.4, 0.35);
  normalMap.repeat.set(4, 4);
  roughnessMap.repeat.set(4, 4);
  return { normalMap, roughnessMap };
}
