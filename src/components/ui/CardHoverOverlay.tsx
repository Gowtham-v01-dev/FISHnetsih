
import React from "react";
import { motion } from "framer-motion";

export interface CardHoverOverlayProps {
  speciesName: string;
  date: string;
  confidence: number;
  health: number;
}

export const CardHoverOverlay: React.FC<CardHoverOverlayProps> = ({
  speciesName,
  date,
  confidence,
  health,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.85 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18 }}
    className="absolute inset-0 flex items-center justify-center bg-slate-900/85 rounded-xl backdrop-blur-md"
    style={{ pointerEvents: "none" }}
  >
    <div className="flex flex-col items-center gap-3 text-center px-6 py-4">
      <div className="text-sky-400 font-bold text-lg mb-1">{speciesName}</div>
      <div className="text-xs text-gray-400 mb-2">{date}</div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-sky-400">
            <span className="inline-block w-4 h-4">⚡</span>
            <span className="font-medium">Confidence</span>
          </div>
          <span className="font-bold text-sky-400">{confidence}%</span>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="inline-block w-4 h-4">💧</span>
            <span className="font-medium">Health</span>
          </div>
          <span className="font-bold text-emerald-400">{health}%</span>
        </div>
      </div>
    </div>
  </motion.div>
);
