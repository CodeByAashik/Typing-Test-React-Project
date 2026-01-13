function Phrase({sentence, loading, userInput, setCorrectCharacter, correctCharacter}) {

  const renderText = () => {
    if (loading) {
      return (
        <p className="text-neutral-500 text-lg animate-pulse">
          Loading text...
        </p>
      );
    }

    return (
      <p className="text-2xl leading-relaxed font-medium">
        {sentence.split('').map((char, index) => {
          console.log(char)
          let className = 'text-neutral-100'; // default color

          if (index < userInput.length) {
            if (char === userInput[index]) {
              className = 'text-green-400'; // correct
              setCorrectCharacter(prev => prev+1)
              console.log('correct', setCorrectCharacter)
            } else {
              className = 'text-red-400'; // incorrect
            }
          } else if (index === userInput.length) {
            className = 'text-neutral-100 underline '; // current position
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <div className="flex justify-center px-4 mt-12 bg-blue-300 w-fit rounded-2xl p-5">
      <div className="max-w-3xl text-center">
        {renderText()}
      </div>
    </div>
  );
}

export default Phrase;
