"use client";

import { useState } from "react";
import { IntroLoader } from "@/components/naturel/intro-loader";
import { Hero } from "@/components/naturel/hero";
import { Disassembly } from "@/components/naturel/disassembly";
import { FabricTouch } from "@/components/naturel/fabric-touch";
import { NumberedCollection } from "@/components/naturel/numbered-collection";
import { Story } from "@/components/naturel/story";
import { Packaging } from "@/components/naturel/packaging";
import { WaitingList } from "@/components/naturel/waiting-list";

export default function NaturelPage() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroLoader onDone={() => setIntroDone(true)} />}
      <main>
        <Hero />
        <Disassembly />
        <FabricTouch />
        <NumberedCollection />
        <Story />
        <Packaging />
        <WaitingList />
        <footer className="px-6 py-14 text-center">
          <p className="naturel-display text-[11px] uppercase tracking-[0.4em] text-naturel-ink/35">
            Naturel — Coastal Series
          </p>
        </footer>
      </main>
    </>
  );
}
