"use client";

import React from "react";
import { Check, Info } from "@phosphor-icons/react";

interface ToastProps {
  message: string | null;
  type?: "info" | "success";
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success" }) => {
  if (!message) return null;

  return (
    <div className="toast-notice" role="status" aria-live="polite">
      {type === "success" ? (
        <Check size={15} weight="bold" color="#ffffff" />
      ) : (
        <Info size={15} weight="bold" color="#ffffff" />
      )}
      <span style={{ color: "#ffffff" }}>{message}</span>
    </div>
  );
};
