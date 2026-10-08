"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import rawData from "../data/wallpapers.json";
import { Wallpaper, WallpapersData } from "../components/types";
import { TopMeta } from "../components/TopMeta";
import { BottomDock } from "../components/BottomDock";
import { SideNavigation } from "../components/SideNavigation";
import { ListViewModal } from "../components/ListViewModal";
import { Toast } from "../components/Toast";

// Fisher-Yates array shuffler
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function WallpaperApp() {
  const data = rawData as WallpapersData;

  // Flatten all wallpapers from category map
  const allWallpapers = useMemo(() => {
    const list: Wallpaper[] = [];
    Object.keys(data.wall).forEach((categoryKey) => {
      list.push(...data.wall[categoryKey]);
    });
    return list;
  }, [data]);

  // Randomized wallpapers playlist
  const [playlist, setPlaylist] = useState<Wallpaper[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"info" | "success">("success");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Initialize randomized playlist on mount
  useEffect(() => {
    if (allWallpapers.length > 0) {
      const randomized = shuffleArray(allWallpapers);
      setPlaylist(randomized);
      setCurrentIndex(0);
    }
  }, [allWallpapers]);

  const currentWallpaper = playlist[currentIndex] || allWallpapers[0];

  const showToast = useCallback((msg: string, type: "info" | "success" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Navigate Up (Previous)
  const handlePrev = useCallback(() => {
    if (playlist.length === 0) return;
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  // Navigate Down (Next)
  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  // Select specific wallpaper from list view
  const handleSelectWallpaper = useCallback((selected: Wallpaper) => {
    const foundIndex = playlist.findIndex((w) => w.id === selected.id);
    if (foundIndex !== -1) {
      setImageLoaded(false);
      setCurrentIndex(foundIndex);
    } else {
      // If not in current shuffled playlist, place it at current index
      setImageLoaded(false);
      setPlaylist((prev) => [selected, ...prev]);
      setCurrentIndex(0);
    }
    showToast(selected.name);
  }, [playlist, showToast]);

  // Toggle true Fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          setIsFullscreen(!isFullscreen);
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  }, [isFullscreen]);

  // Synchronize fullscreen state with browser events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Download wallpaper
  const handleDownload = useCallback(async () => {
    if (!currentWallpaper) return;
    showToast("Downloading...", "info");
    try {
      const response = await fetch(currentWallpaper.url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${currentWallpaper.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast("Downloaded", "success");
    } catch {
      // Fallback for CORS restricted origins: trigger direct download/new tab
      const link = document.createElement("a");
      link.href = currentWallpaper.url;
      link.target = "_blank";
      link.download = `${currentWallpaper.name}.jpg`;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Saved", "success");
    }
  }, [currentWallpaper, showToast]);

  // Share wallpaper
  const handleShare = useCallback(async () => {
    if (!currentWallpaper) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentWallpaper.name,
          text: currentWallpaper.name,
          url: currentWallpaper.url,
        });
        showToast("Shared", "success");
        return;
      } catch {
        // User cancelled or unsupported share target
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(currentWallpaper.url);
      showToast("Link copied", "success");
    } catch {
      showToast("Could not copy link", "info");
    }
  }, [currentWallpaper, showToast]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in search input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        setIsListOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleToggleFullscreen]);

  // Preload neighboring images for instant transitions
  useEffect(() => {
    if (playlist.length > 1) {
      const nextIdx = (currentIndex + 1) % playlist.length;
      const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
      const nextImg = new Image();
      nextImg.src = playlist[nextIdx].url;
      const prevImg = new Image();
      prevImg.src = playlist[prevIdx].url;
    }
  }, [currentIndex, playlist]);

  if (!currentWallpaper) {
    return <div style={{ background: "#000", height: "100vh" }} />;
  }

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--bg-canvas)",
      }}
    >
      {/* Full-Screen Wallpaper Canvas */}
      <div className="wallpaper-canvas-wrapper">
        <img
          key={currentWallpaper.id}
          src={currentWallpaper.url}
          alt={currentWallpaper.name}
          className="wallpaper-image"
          style={{
            opacity: imageLoaded ? 1 : 0.85,
            transform: imageLoaded ? "scale(1)" : "scale(1.02)",
          }}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Ambient Dark Gradient for crisp contrast */}
        <div className="wallpaper-ambient-overlay" />
      </div>

      {/* Top Left: Category & Title (No background, No border) */}
      <TopMeta
        category={currentWallpaper.category}
        name={currentWallpaper.name}
      />

      {/* Right Center: Up and Down Navigation Arrows */}
      <SideNavigation
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Bottom Center: 4 Circle Buttons Grouped Together (Download, List, Share, Fullscreen) */}
      <BottomDock
        onDownload={handleDownload}
        onOpenList={() => setIsListOpen(true)}
        onShare={handleShare}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {/* List Modal View (3x3 on lg, 2x2 on md, 1x1 on sm) */}
      <ListViewModal
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        wallpapers={allWallpapers}
        currentWallpaperId={currentWallpaper.id}
        onSelect={handleSelectWallpaper}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} type={toastType} />
    </main>
  );
}
