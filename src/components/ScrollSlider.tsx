"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollSliderProps {
  children: React.ReactNode;
}

export default function ScrollSlider({ children }: ScrollSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for tracking drag without stale closures
  const mouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollAtRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      checkScrollPosition();
      slider.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
    }
    return () => {
      if (slider) slider.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [children]);

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollOffset = clientWidth * 0.75;
      const targetScroll =
        direction === "left" ? scrollLeft - scrollOffset : scrollLeft + scrollOffset;
      sliderRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  // Use document-level listeners for drag tracking
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      mouseDownRef.current = true;
      hasDraggedRef.current = false;
      startXRef.current = e.pageX;
      scrollAtRef.current = slider.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDownRef.current) return;
      const dx = Math.abs(e.pageX - startXRef.current);

      // Only start "drag mode" once we've moved more than 8px
      if (dx > 8 && !hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      if (hasDraggedRef.current) {
        e.preventDefault();
        const walk = e.pageX - startXRef.current;
        slider.scrollLeft = scrollAtRef.current - walk * 1.5;
      }
    };

    const onMouseUp = () => {
      if (!mouseDownRef.current) return;
      mouseDownRef.current = false;

      // Keep the drag overlay visible briefly so the click event on the link is blocked
      // by the overlay, then remove it
      if (hasDraggedRef.current) {
        setTimeout(() => {
          setIsDragging(false);
          hasDraggedRef.current = false;
        }, 50);
      }
    };

    slider.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="slider-outer-container">
      {showLeftArrow && (
        <button
          className="slider-arrow slider-arrow-left"
          onClick={() => handleScroll("left")}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div
        ref={sliderRef}
        className={`horizontal-scroll${isDragging ? " dragging" : ""}`}
        onDragStart={(e) => e.preventDefault()}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "pan-x pan-y",
          position: "relative",
          userSelect: isDragging ? "none" : "auto",
        }}
      >
        {children}

        {/* Invisible overlay that only appears during an active drag.
            This physically blocks clicks on child Links after a drag release. */}
        {isDragging && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              cursor: "grabbing",
            }}
          />
        )}
      </div>

      {showRightArrow && (
        <button
          className="slider-arrow slider-arrow-right"
          onClick={() => handleScroll("right")}
          aria-label="Scroll Right"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
