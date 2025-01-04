import React, { useState, useEffect } from 'react';

const TypingAnimation = ({ text, delay, infinite = false, styles }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      // Reset the animation whenever the text prop changes
      setCurrentText('');
      setCurrentIndex(0);
    }, [text]);
  
    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);
  
        return () => clearTimeout(timeout);
      } else if (infinite) {
        const timeout = setTimeout(() => {
          setCurrentText('');
          setCurrentIndex(0);
        }, delay);
        return () => clearTimeout(timeout);
      }
    }, [currentIndex, delay, text, infinite]);
  
    // Split text by newlines and map over each line
    const lines = currentText.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  
    return <span className={styles}>{lines}</span>;
  };
  

export default TypingAnimation;