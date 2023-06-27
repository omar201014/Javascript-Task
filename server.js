const express = require("express");
const cors = require("cors");
const testData = require("./TestData.json");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/words", (req, res) => {
  const wordsList = testData.wordList;
  const words = [];
  const selectedWords = {};

  // Select one word of each type
  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    if (!selectedWords[word.word]) {
      selectedWords[word.pos] = word;
      words.push(word);
    }
  }

  // Select random words to complete the list
  while (words.length < 10) {
    const word = wordsList[Math.floor(Math.random() * wordsList.length)];
    if (!selectedWords[word.word]) {
      selectedWords[word.pos] = word;
      words.push(word);
    }
  }

  res.json(words);
});

app.post("/rank", (req, res) => {
  const { score } = req.body;
  const { scoresList } = testData; // Use scoresList instead of scoreList
  const rank =
    ((scoresList.length - scoresList.filter((s) => s >= score).length) /
      scoresList.length) * // Use scoresList instead of scoreList
    100;
  res.json({ rank: rank.toFixed(2) });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));