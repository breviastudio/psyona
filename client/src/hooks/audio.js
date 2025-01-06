export function speak(msg) {
    const utterance = new SpeechSynthesisUtterance(msg);
  
    // Wait for voices to be loaded
    speechSynthesis.onvoiceschanged = function() {
      const voices = speechSynthesis.getVoices();
  
      // Loop through voices and select a female one
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name.toLowerCase().includes("female")) {
          utterance.voice = voices[i];  // Choose the first female voice found
          break;
        }
      }
  
      // Speak the text
      speechSynthesis.speak(utterance);
    };
  
    // If voices are already loaded (some browsers might preload them), directly call speak
    if (speechSynthesis.getVoices().length > 0) {
      const voices = speechSynthesis.getVoices();
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name.toLowerCase().includes("female")) {
          utterance.voice = voices[i];  // Choose the first female voice found
          break;
        }
      }
      speechSynthesis.speak(utterance);
    }
}
  