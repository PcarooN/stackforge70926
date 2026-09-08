"use client";
import { useEffect } from "react";
export default function LandingMotion() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.querySelector('.sf[data-reduced-motion="true"]')
    )
      return;
    const nodes = document.querySelectorAll(
      ".sf-white-edition .sf-section-heading,.sf-white-edition .sf-plan,.sf-white-edition .sf-steps article,.sf-white-edition .sf-timeline li",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("sf-arrived");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
  return null;
}
