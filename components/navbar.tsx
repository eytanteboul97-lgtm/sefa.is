"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const links = [
  { href: "#salons", label: "Discover" },
  { href: "#for-salons", label: "For salons" },
  { href: "#pricing", label: "Pricing" },
  { href: "#signup", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
          scrolled ? "glass-dark shadow-glass" : "bg-transparent"
        }`}
      >
        <a href="#" className="text-2xl text-paper">
          <Logo dark />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm text-paper/65 transition-colors hover:text-gold-light"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-light transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button className="hidden text-sm text-paper/50 hover:text-paper sm:block">
            עב
          </button>
          <Button size="sm" className="mirror-shine hidden sm:inline-flex">
            List your salon
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
