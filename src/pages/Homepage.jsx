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
      <Navbar />
      <div className='flex items-center justify-center'>
        <Phrase sentence={sentence} loading={loading} userInput={userInput} setCorrectCharacter={setCorrectCharacter}/>
      </div>
        <Keyboard />
    </div>
  )
}

export default Homepage
