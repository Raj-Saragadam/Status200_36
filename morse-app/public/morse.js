const morseCode = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 
    'y': '-.--', 'z': '--..', '1': '.----', '2': '..---', '3': '...--', 
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
    '9': '----.', '0': '-----', ' ': ' '
  };
  
  const dotDuration = 200; // duration of a dot in milliseconds
  const dashDuration = dotDuration * 3; // duration of a dash
  const intraCharGap = dotDuration; // gap between dots and dashes within a character
  const charGap = dotDuration * 4; // gap between characters
  const wordGap = dotDuration * 7; // gap between words
  
  // Function to convert text to Morse code
  function textToMorse(text) {
    return text.toLowerCase().split('').map(char => morseCode[char] || '').join(' ');
  }
  
  // Function to generate vibration pattern from Morse code
  function morseToVibrationPattern(morse) {
    const pattern = [];
    for (const char of morse) {
      switch (char) {
        case '.':
          pattern.push(dotDuration);
          pattern.push(intraCharGap);
          break;
        case '-':
          pattern.push(dashDuration);
          pattern.push(intraCharGap);
          break;
        case ' ':
          if (pattern.length && pattern[pattern.length - 1] !== charGap) {
            pattern.push(charGap);
          }
          break;
        default:
          break;
      }
    }
    // Remove the last intra-character gap
    if (pattern.length && pattern[pattern.length - 1] === intraCharGap) {
      pattern.pop();
    }
    return pattern;
  }
  // Function to process the input text and trigger vibrations
  function processText() {
    const inputText = document.getElementById('highlighted-text').value;
    console.log(`Input text: ${inputText}`);
    const morse = textToMorse(inputText);
    let a = `Morse code: ${morse}`
    console.log(a);
    document.getElementById("morsecode").innerHTML=a;
    const vibrationPattern = morseToVibrationPattern(morse);
    if (navigator.vibrate) {
      navigator.vibrate(vibrationPattern);
    } else {
      console.log("Vibration API not supported on this device.");
      simulateVibrations(vibrationPattern);
    }
  }
  
  // Function to simulate vibrations on a laptop using console logs and visual feedback
  function simulateVibrations(pattern) {
    const displayElement = document.getElementById('vibration-display');
    let totalDuration = 0;
  
    for (const duration of pattern) {
      totalDuration += duration;
    }
  }