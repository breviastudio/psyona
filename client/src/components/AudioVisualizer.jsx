import React from "react";
import { VisualizerBars } from "./VisualizerBars";

const AudioVisualizer = ({ audioData }) => {
  return (
    <div className="flex flex-col items-center justify-between gap-6">
      <VisualizerBars audioData={audioData} />
    </div>
  );
};

export default AudioVisualizer;
