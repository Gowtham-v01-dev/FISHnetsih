import React, { useState } from "react";
import { CardHoverOverlay } from "./CardHoverOverlay";

const cardData = [
  {
    speciesName: "Rainbow Trout",
    timestamp: "2025-11-28",
    confidence: 92,
    health: 87,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    speciesName: "Bluegill",
    timestamp: "2025-11-27",
    confidence: 85,
    health: 90,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  }
];

export const CardGridExample: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-slate-50 min-h-screen">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="relative group rounded-xl overflow-hidden shadow-lg bg-white"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          style={{ minHeight: 260 }}
        >
          <img
            src={card.image}
            alt={card.speciesName}
            className="w-full h-48 object-cover"
          />
          {hovered === idx && (
            <CardHoverOverlay
              speciesName={card.speciesName}
              timestamp={new Date(card.timestamp).toLocaleDateString()}
              confidence={card.confidence}
              health={card.health}
            />
          )}
        </div>
      ))}
    </div>
  );
};
