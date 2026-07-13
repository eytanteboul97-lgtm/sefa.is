"use client";

import { EffectComposer, DepthOfField, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * A photographic finishing pass — shallow depth of field, a whisper of
 * bloom off the highlights, a soft vignette, and fine film grain — so a
 * still frame reads closer to a studio product shot than a game-engine
 * render. Tuned around a subject sitting near the world origin with the
 * camera a few units back (see hero/disassembly camera settings).
 */
export function PostFX({
  focusDistance = 0.3,
  bokehScale = 3,
}: {
  focusDistance?: number;
  bokehScale?: number;
}) {
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField focusDistance={focusDistance} focalLength={0.02} bokehScale={bokehScale} height={480} />
      <Bloom intensity={0.25} luminanceThreshold={0.82} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.55} />
      <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} premultiply />
    </EffectComposer>
  );
}
