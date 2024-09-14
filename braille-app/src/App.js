import React, { useState } from 'react';
import './App.css';

// Simple Braille pattern for A-Z (6-dot)
const braillePatterns = {
  'a': [1, 0, 0, 0, 0, 0]
};

const BrailleDot = ({ isActive }) => {
  const handleHover = () => {
    if (isActive && navigator.vibrate) {
      navigator.vibrate(100); // Vibrates for 100ms
    }
  };

  return (
    <div
      className={`dot ${isActive ? 'active-dot' : 'inactive-dot'}`}
      onMouseEnter={handleHover} // Triggers vibration on hover for desktop
      onTouchMove={handleHover} // Triggers vibration on touch move for mobile
    />
  );
};

const App = () => {
  const [text, setText] = useState('a');

  const renderBraille = (letter) => {
    const pattern = braillePatterns[letter] || [0, 0, 0, 0, 0, 0];
    return (
      <div className="braille-letter">
        {pattern.map((dot, index) => (
          <BrailleDot key={index} isActive={dot === 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Braille Lipi Converter</h1>
      <div className="braille-container">
        {text.split('').map((letter, index) => (
          <div key={index} className="braille-letter-wrapper">
            {renderBraille(letter)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
