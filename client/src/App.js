import React, { useState, useEffect } from "react";
import axios from "axios";

function PracticeScreen({ words, onAnswer }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const currentWord = words[currentWordIndex];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = currentWord.pos === option;
    setIsCorrect(isCorrect);
    onAnswer(isCorrect);
  };

  const handleNextWord = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentWordIndex((i) => i + 1);
  };

  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <div>
      <h2>Practice Screen</h2>
      <p>
        Word {currentWordIndex + 1} of {words.length}
      </p>
      <h3>{currentWord.word}</h3>
      <div>
        <button disabled={selectedOption} onClick={() => handleOptionSelect("noun")}>
          Noun
        </button>
        <button disabled={selectedOption} onClick={() => handleOptionSelect("adverb")}>
          Adverb
        </button>
        <button disabled={selectedOption} onClick={() => handleOptionSelect("adjective")}>
          Adjective
        </button>
        <button disabled={selectedOption} onClick={() => handleOptionSelect("verb")}>
          Verb
        </button>
      </div>
      {isCorrect !== null && (
        <p>{isCorrect ? "Correct!" : "Incorrect."}</p>
      )}
      <progress value={progress} max="100"></progress>
      <p>{progress.toFixed(2)}% completed</p>
      {selectedOption && (
        <button disabled={!isCorrect} onClick={handleNextWord}>
          Next Word
        </button>
      )}
    </div>
  );
}

function RankScreen({ score, onTryAgain }) {
  const [rank, setRank] = useState(null);

  const handleTryAgain = () => {
    setRank(null);
    onTryAgain();
  };

  useEffect(() => {
    axios.post("/rank", { score }).then((response) => {
      setRank(response.data.rank);
    });
  }, [score]);

  return (
    <div>
      <h2>Rank Screen</h2>
      {rank !== null ? (
        <p>Your rank is {rank}%.</p>
      ) : (
        <p>Calculating your rank...</p>
      )}
      <button onClick={handleTryAgain}>Try Again</button>
    </div>
  );
}

function App() {
  const [words, setWords] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showRankScreen, setShowRankScreen] = useState(false);

  const handleAnswer = (isCorrect) => {
    setAnswers((prevAnswers) => [...prevAnswers, isCorrect]);
    if (answers.length === words.length - 1) {
      setShowRankScreen(true);
    }
  };

  const handleTryAgain = () => {
    setWords(null);
    setAnswers([]);
    setShowRankScreen(false);
  };

  useEffect(() => {
    axios.get("/words").then((response) => {
      setWords(response.data);
    });
  }, []);

  const score =
    answers.filter((answer) => answer).length / answers.length || 0;

  return (
    <div>
      {words ? (
        showRankScreen ? (
          <RankScreen score={score} onTryAgain={handleTryAgain} />
        ) : (
          <PracticeScreen words={words} onAnswer={handleAnswer} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;