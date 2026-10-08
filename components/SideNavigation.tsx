"use client";

import React from "react";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

interface SideNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  onPrev,
  onNext,
}) => {
  return (
    <aside className="right-center-nav" aria-label="Wallpaper Navigation">
      <button
        type="button"
        className="nav-arrow-btn"
        onClick={onPrev}
        aria-label="Previous"
        title="Previous (↑)"
      >
        <CaretUp size={18} weight="bold" />
      </button>

      <button
        type="button"
        className="nav-arrow-btn"
        onClick={onNext}
        aria-label="Next"
        title="Next (↓)"
      >
        <CaretDown size={18} weight="bold" />
      </button>
    </aside>
  );
};
