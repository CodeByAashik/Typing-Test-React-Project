import React, { useEffect, useState, useRef } from 'react'
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
  const [testComplete, setTestComplete] = useState(false);
  const [averageWpm, setAverageWpm] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [metricsLog, setMetricsLog] = useState([]);
  
  const userInputRef = useRef('');
  const correctCharacterRef = useRef(0);
  const secondCounterRef = useRef(0);

  // Clean the raw text by removing unwanted characters
  const cleanText = (text) => {
      return text
        .replace(/[“”‘’'"]/g, "")     // quotes
        .replace(/[.,;:!?]/g, "")     // punctuation
        .replace(/\s+/g, " ")         // extra spaces
        .trim();
    };


  // fetch the raw sentence from the API
  const fetchSentence = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://api.quotable.io/random?minLength=200&maxLength=220");
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
    userInputRef.current = userInput;
  }, [userInput, startTime]);

  // Track correct character changes
  useEffect(() => {
    correctCharacterRef.current = correctCharacter;
  }, [correctCharacter]);

  // Update elapsed time and calculate speed metrics
  useEffect(() => {
    if (startTime === null || testComplete) return;

    secondCounterRef.current = 0;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // in seconds
      setElapsedTime(elapsed);

      const currentInput = userInputRef.current;
      const currentCorrect = correctCharacterRef.current;

      // Calculate WPM (assuming average word length of 5 characters)
      const minutes = elapsed / 60;
      const words = currentInput.length / 5;
      const currentWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      setWpm(currentWpm);

      // Calculate accuracy
      if (currentInput.length > 0) {
        const currentAccuracy = Math.round((currentCorrect / currentInput.length) * 100);
        setAccuracy(currentAccuracy);
      }

      // Log metrics every second
      if (Math.floor(elapsed) > secondCounterRef.current) {
        secondCounterRef.current = Math.floor(elapsed);
        const logEntry = {
          second: secondCounterRef.current,
          wpm: currentWpm,
          accuracy: currentInput.length > 0 ? Math.round((currentCorrect / currentInput.length) * 100) : 0
        };
        console.log(`[Second ${logEntry.second}] WPM: ${logEntry.wpm}, Accuracy: ${logEntry.accuracy}%`);
        setMetricsLog(prev => [...prev, logEntry]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, testComplete]);

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

  // Check if test is complete
  useEffect(() => {
    if (sentence && userInput.length === sentence.length && userInput.length > 0 && startTime !== null && !testComplete) {
      setTestComplete(true);
    }
  }, [userInput, sentence, startTime, testComplete]);

  // Calculate and display averages when test completes
  useEffect(() => {
    if (testComplete && metricsLog.length > 0) {
      const avgWpm = Math.round(metricsLog.reduce((sum, log) => sum + log.wpm, 0) / metricsLog.length);
      const avgAccuracy = Math.round(metricsLog.reduce((sum, log) => sum + log.accuracy, 0) / metricsLog.length);
      setAverageWpm(avgWpm);
      setAverageAccuracy(avgAccuracy);

      console.log('=== TEST COMPLETE ===');
      console.log('Metrics Log:', metricsLog);
      console.log(`Average WPM: ${avgWpm}`);
      console.log(`Average Accuracy: ${avgAccuracy}%`);
    }
  }, [testComplete, metricsLog]);

  return (
    <div>
      <Navbar wpm={wpm} accuracy={accuracy} elapsedTime={elapsedTime} />
      <div className='flex items-center justify-center'>
        <Phrase sentence={sentence} loading={loading} userInput={userInput} setCorrectCharacter={setCorrectCharacter} correctCharacter={correctCharacter}/>
      </div>
      {testComplete && (
        <div className='flex justify-center mt-8'>
          <div className='bg-gray-600 rounded-lg p-8 max-w-2xl text-center border-2 border-green-400'>
            <h2 className='text-3xl font-bold text-green-400 mb-6'>Test Complete!</h2>
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <p className='text-gray-300 text-sm mb-2'>Average WPM</p>
                <p className='text-4xl font-bold text-white'>{averageWpm}</p>
              </div>
              <div>
                <p className='text-gray-300 text-sm mb-2'>Average Accuracy</p>
                <p className='text-4xl font-bold text-green-400'>{averageAccuracy}%</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setUserInput('');
                setCorrectCharacter(0);
                setStartTime(null);
                setElapsedTime(0);
                setWpm(0);
                setAccuracy(100);
                setTestComplete(false);
                setMetricsLog([]);
                setAverageWpm(0);
                setAverageAccuracy(0);
                fetchSentence();
              }}
              className='mt-8 px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg transition'
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <Keyboard />
    </div>
  )
}

export default Homepage;