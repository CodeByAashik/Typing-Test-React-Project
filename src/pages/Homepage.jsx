import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Phrase from '../components/Phrase.jsx';
import Navbar from '../components/Navbar.jsx';

function Homepage() {
  const [userInput, setUserInput] = useState('');

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

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center'>
        <Phrase sentence={sentence} loading={loading} />
      </div>
    </div>
  )
}

export default Homepage
