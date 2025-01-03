import React from 'react';

export const VisualizerBars = ({ audioData }) => (
  <div className="flex gap-1.5 items-center h-16">
    {audioData.map((value, index) => (
      <div
        key={index}
        className="w-2 bg-white rounded-full"
        style={{
          height: `${Math.max(12, value * 100)}%`,
          transition: 'height 0.2s ease-out',
        }}
      />
    ))}
  </div>
);
