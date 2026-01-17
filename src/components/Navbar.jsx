import React from 'react'

function Navbar({ wpm = 0, accuracy = 100, elapsedTime = 0 }) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className='p-3 bg-blue-950 backdrop-blur-3xl border-black flex justify-between items-center'>
            <div className='text-4xl font-bold text-white '>
                Banana <span className='text-blue-800'> Type</span>
            </div>
            <div className='flex gap-8 items-center text-white text-lg'>
                <div className='flex flex-col items-center'>
                    <span className='text-sm text-gray-400'>WPM</span>
                    <span className='text-2xl font-bold text-blue-400'>{wpm}</span>
                </div>
                <div className='flex flex-col items-center'>
                    <span className='text-sm text-gray-400'>Accuracy</span>
                    <span className='text-2xl font-bold text-green-400'>{accuracy}%</span>
                </div>
                <div className='flex flex-col items-center'>
                    <span className='text-sm text-gray-400'>Time</span>
                    <span className='text-2xl font-bold text-purple-400'>{formatTime(elapsedTime)}</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar
