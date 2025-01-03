// useAudioInput.js
import { useState, useEffect, useRef } from 'react';
import { setupAudioContext, createBands } from '../utils/audioUtils';

export const useAudioInput = () => {
  const [audioData, setAudioData] = useState(new Array(5).fill(0));
  const [isListening, setIsListening] = useState(false);

  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const previousDataRef = useRef(new Array(5).fill(0));

  const startListening = async () => {
    try {
      const { analyser, dataArray, stream } = await setupAudioContext();
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      streamRef.current = stream;
      setIsListening(true);
      animate();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
    setAudioData(new Array(5).fill(0));
    previousDataRef.current = new Array(5).fill(0);
  };

  const animate = () => {
    if (!analyserRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const newAudioData = createBands(dataArrayRef.current);

    // Apply temporal smoothing
    const smoothedData = newAudioData.map((value, index) => {
      const prevValue = previousDataRef.current[index];
      const smoothingFactor = 0.7; // Adjust for desired smoothness
      return prevValue * smoothingFactor + value * (1 - smoothingFactor);
    });

    previousDataRef.current = smoothedData;
    setAudioData(smoothedData);

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    audioData,
    isListening,
    startListening,
    stopListening,
  };
};