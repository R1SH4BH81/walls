"use client";

import React from "react";
import {
  DownloadSimple,
  SquaresFour,
  ShareNetwork,
  CornersOut,
  CornersIn,
} from "@phosphor-icons/react";

interface BottomDockProps {
  onDownload: () => void;
  onOpenList: () => void;
  onShare: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  onDownload,
  onOpenList,
  onShare,
  onToggleFullscreen,
  isFullscreen,
}) => {
  return (
    <nav className="bottom-dock-container" aria-label="Wallpaper Quick Controls">
      <button
        type="button"
        className="dock-circle-btn"
        onClick={onDownload}
        data-tooltip="Download"
        aria-label="Download"
      >
        <DownloadSimple size={18} weight="bold" />
      </button>

      <button
        type="button"
        className="dock-circle-btn"
        onClick={onOpenList}
        data-tooltip="Browse (L)"
        aria-label="Browse"
      >
        <SquaresFour size={18} weight="bold" />
      </button>

      <button
        type="button"
        className="dock-circle-btn"
        onClick={onShare}
        data-tooltip="Share"
        aria-label="Share"
      >
        <ShareNetwork size={18} weight="bold" />
      </button>

      <button
        type="button"
        className="dock-circle-btn"
        onClick={onToggleFullscreen}
        data-tooltip={isFullscreen ? "Exit (F)" : "Fullscreen (F)"}
        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <CornersIn size={18} weight="bold" />
        ) : (
          <CornersOut size={18} weight="bold" />
        )}
      </button>
    </nav>
  );
};
