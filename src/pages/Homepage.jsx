import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Phrase from '../components/Phrase.jsx';
import Navbar from '../components/Navbar.jsx';
import Keyboard from '../components/Keyboard.jsx';

function Homepage() {
  const [userInput, setUserInput] = useState('');
  const [correctCharacter, setCorrectCharacter] = useState(0);

  const [sentence, setSentence] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Clean the raw text by removing unwanted characters
  const cleanText = (text) => {
      return text
        .replace(/[“”‘’'"]/g, "")     // quotes
        .replace(/[.,;:!?]/g, "")    // punctuation 
        .replace(/\s+/g, " ")        // extra spaces
        .trim();
    };


    // fetch the raw sentence from the API
  const fetchSentence = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.quotable.io/random?minLength=200&maxLength=220");
      const raw = response.data.content.toLowerCase();
      setSentence(cleanText(raw));
    } catch (e) {
      console.log("[Error] while fetching sentence:", e);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchSentence();
  }, []);

  // Track elapsed time when user starts typing
  useEffect(() => {
    if (userInput.length > 0 && startTime === null) {
      setStartTime(Date.now());
    }
  }, [userInput, startTime]);

  // Update elapsed time and calculate speed metrics
  useEffect(() => {
    if (startTime === null) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // in seconds
      setElapsedTime(elapsed);

      // Calculate WPM (assuming average word length of 5 characters)
      const minutes = elapsed / 60;
      const words = userInput.length / 5;
      const currentWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      setWpm(currentWpm);

      // Calculate accuracy
      if (userInput.length > 0) {
        const currentAccuracy = Math.round((correctCharacter / userInput.length) * 100);
        setAccuracy(currentAccuracy);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, userInput.length, correctCharacter]);

useEffect(() => {
    const handleKeyDown = (event) => {
      let key = event.key;
      if (loading) return;
      if(key === 'Backspace'){
        setUserInput(prev => prev.slice(0, -1))
      }else if(key.length === 1){
        setUserInput(prev => prev+key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [loading])

  return (
    <div>
      <Navbar wpm={wpm} accuracy={accuracy} elapsedTime={elapsedTime} />
      <div className='flex items-center justify-center'>
        <Phrase sentence={sentence} loading={loading} userInput={userInput} setCorrectCharacter={setCorrectCharacter} correctCharacter={correctCharacter}/>
      </div>
        <Keyboard />
    </div>
  )
}

export default Homepage
