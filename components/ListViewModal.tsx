"use client";

import React, { useEffect, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import { Wallpaper } from "./types";

interface ListViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpapers: Wallpaper[];
  currentWallpaperId: string;
  onSelect: (wallpaper: Wallpaper) => void;
}

export const ListViewModal: React.FC<ListViewModalProps> = ({
  isOpen,
  onClose,
  wallpapers,
  currentWallpaperId,
  onSelect,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Group wallpapers by category
  const groupedWallpapers = useMemo(() => {
    const map: Record<string, Wallpaper[]> = {};
    wallpapers.forEach((w) => {
      const cat = w.category || "collection";
      if (!map[cat]) map[cat] = [];
      map[cat].push(w);
    });
    return map;
  }, [wallpapers]);

  if (!isOpen) return null;

  return (
    <div
      className="list-view-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Wallpaper Collection"
    >
      {/* Top sticky controls */}
      <div className="list-view-top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <kbd className="kbd-badge" style={{ color: "#ffffff" }}>
            ESC
          </kbd>
          <button
            type="button"
            className="close-list-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} weight="bold" color="#ffffff" />
          </button>
        </div>
      </div>

      {/* gxuri.me/gallery Centered Max-W-5xl Container */}
      <div className="gallery-container">
        {Object.entries(groupedWallpapers).map(([category, items]) => {
          const formattedCategoryName =
            category.charAt(0).toUpperCase() + category.slice(1);

          return (
            <div key={category} className="gallery-section">
              <h2 className="gallery-section-title">
                {formattedCategoryName} [{items.length}]
              </h2>

              {/* 3x3 lg, 2x2 md, 1x1 sm grid with max-w-5xl */}
              <div className="gallery-grid">
                {items.map((item) => {
                  const isCurrent = item.id === currentWallpaperId;

                  return (
                    <div
                      key={item.id}
                      className="gallery-item"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onSelect(item);
                          onClose();
                        }
                      }}
                    >
                      {/* h-52 16px-radius image wrapper */}
                      <div
                        className={`gallery-image-wrapper ${
                          isCurrent ? "active-image" : ""
                        }`}
                      >
                        <img
                          src={item.thumb}
                          alt={item.name}
                          className="gallery-image"
                          loading="lazy"
                        />
                      </div>

                      {/* Dash filling rest on left + Wallpaper Title on right */}
                      <div className="gallery-meta-row">
                        <div className="gallery-meta-line" />
                        <p className="gallery-meta-name">
                          <span>{item.name}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {wallpapers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "14px",
            }}
          >
            No wallpapers found.
          </div>
        )}
      </div>
    </div>
  );
};
