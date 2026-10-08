"use client";

import React from "react";

interface TopMetaProps {
  category: string;
  name: string;
}

export const TopMeta: React.FC<TopMetaProps> = ({ category, name }) => {
  return (
    <header className="hero-meta-container" aria-label="Wallpaper Information">
      <span className="category-text">{category}</span>
      <h1 className="title-text">{name}</h1>
    </header>
  );
};
