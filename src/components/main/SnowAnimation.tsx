interface Snowflake {
  id: number;
  size: number;
  startX: number;
  startY: number; // Added for initial vertical position
  duration: number;
  delay: number;
}

import React, { useState, useEffect } from "react";

const SnowAnimation: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  // Generate random parameters for each snowflake
  const createSnowflake = (index: number): Snowflake => {
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const startY = Math.random() * -100; // Random starting position above viewport
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5; // Reduced max delay for more continuous effect

    return {
      id: index,
      size,
      startX,
      startY,
      duration,
      delay,
    };
  };

  useEffect(() => {
    // Create initial snowflakes
    const initialSnowflakes: Snowflake[] = Array.from({ length: 200 }, (_, i) =>
      createSnowflake(i)
    );
    setSnowflakes(initialSnowflakes);

    // Periodically refresh snowflakes that have completed their animation
    const interval = setInterval(() => {
      setSnowflakes((prev) => {
        const newSnowflakes = [...prev];
        const refreshIndex = Math.floor(Math.random() * newSnowflakes.length);
        newSnowflakes[refreshIndex] = createSnowflake(
          prev[refreshIndex]?.id || 0
        );
        return newSnowflakes;
      });
    }, 2000); // Increased refresh rate for smoother continuous effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="animate-snow absolute"
          style={{
            left: `${flake.startX}%`,
            top: `${flake.startY}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(220, 235, 255, 0.95))",
            borderRadius: "50%",
            opacity: 0.9,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            boxShadow: `
              0 0 3px rgba(0, 40, 120, 0.2),
              0 0 1px rgba(0, 40, 120, 0.3)
            `,
          }}
        />
      ))}
      <style>
        {`
            @keyframes snow {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              100% {
                transform: translateY(120vh) rotate(360deg);
                opacity: 0.2;
              }
            }
            
            .animate-snow {
              animation: snow linear infinite;
            }
          `}
      </style>
    </div>
  );
};

export default SnowAnimation;
