// audioUtils.js
export const setupAudioContext = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
    },
  });

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);

  // Create multiple filters for voice optimization
  const lowPassFilter = audioContext.createBiquadFilter();
  lowPassFilter.type = 'lowpass';
  lowPassFilter.frequency.value = 4000; // Human voice rarely exceeds 4kHz

  const highPassFilter = audioContext.createBiquadFilter();
  highPassFilter.type = 'highpass';
  highPassFilter.frequency.value = 85; // Cut very low frequencies (fan noise, wind)
  highPassFilter.Q.value = 1.0; // Quality factor for steeper roll-off

  // Add a peak filter to emphasize voice frequencies
  const peakFilter = audioContext.createBiquadFilter();
  peakFilter.type = 'peaking';
  peakFilter.frequency.value = 2500; // Boost speech frequencies
  peakFilter.Q.value = 1.0;
  peakFilter.gain.value = 6; // Boost by 6dB

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024; // Increased for better frequency resolution
  analyser.smoothingTimeConstant = 0.5; // Balanced smoothing

  // Connect the audio processing chain
  source
    .connect(highPassFilter)
    .connect(lowPassFilter)
    .connect(peakFilter)
    .connect(analyser);

  return {
    analyser,
    dataArray: new Uint8Array(analyser.frequencyBinCount),
    stream, // Return stream for cleanup
  };
};

export const createBands = (dataArray) => {
  const numBars = 5;
  
  // Define frequency bands more focused on speech (Hz)
  const frequencyBands = [
    { start: 85, end: 255 },    // Low speech frequencies
    { start: 256, end: 510 },   // Main speech fundamentals
    { start: 511, end: 1200 },  // Vowel formants
    { start: 1201, end: 2400 }, // Consonants
    { start: 2401, end: 4000 }  // High speech harmonics
  ];

  // Convert frequency ranges to FFT bin indices
  const binRanges = frequencyBands.map(({ start, end }) => ({
    startBin: Math.floor((start * 1024) / 48000),
    endBin: Math.floor((end * 1024) / 48000)
  }));

  const bandValues = binRanges.map(({ startBin, endBin }) => {
    const band = dataArray.slice(startBin, endBin);
    const sum = band.reduce((acc, val) => acc + val, 0);
    const avg = sum / band.length;

    // Dynamic threshold with noise floor estimation
    const noiseFloor = 30;
    const dynamicThreshold = Math.max(noiseFloor, avg * 0.15);
    
    // Nonlinear scaling to emphasize voice
    let normalized = avg > dynamicThreshold ? 
      Math.pow((avg - dynamicThreshold) / (255 - dynamicThreshold), 1.5) : 0;
    
    // Temporal smoothing
    normalized = Math.min(1, Math.max(0, normalized));
    
    return normalized;
  });

  return bandValues;
};