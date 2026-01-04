function Phrase({sentence, loading}) {

  return (
    <div className="flex justify-center px-4 mt-12 bg-blue-300 w-fit rounded-2xl p-5">
      <div className="max-w-3xl text-center">
        {loading ? (
          <p className="text-neutral-500 text-lg animate-pulse">
            Loading text...
          </p>
        ) : (
          <p className="text-2xl leading-relaxed font-medium text-neutral-100">
            {sentence}
          </p>
        )}
      </div>
    </div>
  );
}

export default Phrase;
