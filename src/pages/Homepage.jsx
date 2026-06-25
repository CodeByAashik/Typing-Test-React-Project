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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl'>
            <h2 className='text-2xl font-bold text-white mb-6'>Test Complete!</h2>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='rounded-3xl bg-white/10 p-5 border border-white/10'>
                <p className='text-xs uppercase tracking-[0.2em] text-white/60 mb-2'>Average WPM</p>
                <p className='text-4xl font-semibold text-white'>{averageWpm}</p>
              </div>
              <div className='rounded-3xl bg-white/10 p-5 border border-white/10'>
                <p className='text-xs uppercase tracking-[0.2em] text-white/60 mb-2'>Average Accuracy</p>
                <p className='text-4xl font-semibold text-green-300'>{averageAccuracy}%</p>
              </div>
              <div className='rounded-3xl bg-white/10 p-5 border border-white/10'>
                <p className='text-xs uppercase tracking-[0.2em] text-white/60 mb-2'>Total time</p>
                <p className='text-4xl font-semibold text-white'>{Math.round(elapsedTime)}s</p>
              </div>
              <div className='rounded-3xl bg-white/10 p-5 border border-white/10'>
                <p className='text-xs uppercase tracking-[0.2em] text-white/60 mb-2'>Sentence length</p>
                <p className='text-4xl font-semibold text-white'>{sentence.length} chars</p>
              </div>
            </div>
            <div className='mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
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
                className='rounded-full bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-500/20 transition hover:bg-blue-500'
              >
                Try Again
              </button>
              <button
                onClick={() => setTestComplete(false)}
                className='rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white transition hover:bg-white/20'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Keyboard />
    </div>
  )
}

export default Homepage;