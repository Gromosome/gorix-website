"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import { cdnUrl } from "@/lib/content";

type ImageSliderProps = {
  slides: { src: string; alt: string }[];
};

export function ImageSlider({ slides }: ImageSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const move = (direction: number) => setActive((value) => (value + direction + slides.length) % slides.length);

  return (
    <div className="slider-shell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="slider-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className="slide" key={slide.src} aria-hidden={active !== index}>
            <Image src={cdnUrl(slide.src)} alt={slide.alt} fill sizes="(max-width: 900px) 94vw, 1200px" priority={index === 0} />
          </div>
        ))}
      </div>
      <button type="button" className="slider-arrow slider-arrow-left" onClick={() => move(-1)} aria-label="Previous slide"><ChevronLeftIcon /></button>
      <button type="button" className="slider-arrow slider-arrow-right" onClick={() => move(1)} aria-label="Next slide"><ChevronRightIcon /></button>
      <div className="slider-dots" role="tablist" aria-label="Select slide">
        {slides.map((slide, index) => (
          <button key={slide.src} type="button" className={active === index ? "slider-dot active" : "slider-dot"} onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}`} aria-selected={active === index} role="tab" />
        ))}
      </div>
    </div>
  );
}
