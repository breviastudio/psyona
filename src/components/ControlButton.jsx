import React from "react";
import { Mic, CircleStop, Volume2, CircleX } from "lucide-react";

export const ControlButton = ({ isListening, onClick }) => (
  <div className="flex items-center justify-center p-2 my-5 gap-4 w-max backdrop-blur-xl bg-transparent border border-white m-auto rounded-md drop-shadow-md">
    <button
      onClick={onClick}
      className="rounded-full transition-colors text-white hover:text-gray-300"
      aria-label="Mute"
    >
      <Volume2 strokeWidth={1.5} />
    </button>
    <button
      onClick={onClick}
      className="rounded-full transition-colors text-white hover:text-gray-300"
      aria-label={isListening ? "Stop" : "Play"}
    >
      {isListening ? (
        <CircleStop strokeWidth={1.5} />
      ) : (
        <Mic strokeWidth={1.5} />
      )}
    </button>
    <button
      onClick={onClick}
      className="rounded-full transition-colors text-white hover:text-gray-300"
      aria-label="Cancel"
    >
      <CircleX strokeWidth={1.5} />
    </button>
  </div>
);
