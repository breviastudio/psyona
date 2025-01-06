import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { sendMessage } from '../services/api';
import TypingAnimation from './TypingAnimation';
import { speak } from '../hooks/audio';

export const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await sendMessage(message);
      setResponse(data);
      // console.log(data.response);
      speak(data)
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-lg m-5">
      <div className="bg-white/10 rounded-lg p-4 mb-4 min-h-[100px] backdrop-blur-sm">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <p className="text-white">
            {isLoading ? (
              <TypingAnimation text="..." delay={100} infinite styles={"font-bold"} />
            ) : response ? (
              <TypingAnimation text={response} delay={85} />
            ) : (
              <span>AI response will appear here...</span>
            )}
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 backdrop-blur-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

