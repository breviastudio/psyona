import AudioVisualizer from "./components/AudioVisualizer";
import Navbar from "./components/Navbar";
import { useAudioInput } from "./hooks/useAudioInput";
import { ControlButton } from "./components/ControlButton";
import { ChatBox } from "./components/ChatBox";

function App() {
  const { audioData, isListening, startListening, stopListening } =
    useAudioInput();

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between h-[100vh]">
        <Navbar />
        <AudioVisualizer audioData={audioData} />
        <ControlButton isListening={isListening} onClick={toggleListening} />
        <ChatBox />
      </div>
    </>
  );
}

export default App;
