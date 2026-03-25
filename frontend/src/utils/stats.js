export const updateStats = (type, action) => {
  let stats;

  try {
    stats = JSON.parse(localStorage.getItem("stats")) || {
      documents: 0,
      flashcards: 0,
      quizzes: 0
    };
  } catch {
    stats = {
      documents: 0,
      flashcards: 0,
      quizzes: 0
    };
  }

  const update = (key) => {
    if (action === "add") {
      stats[key] += 1;
    } else if (action === "remove") {
      stats[key] = Math.max(0, stats[key] - 1);
    }
  };
 
  if (type === "document") update("documents");
  else if (type === "flashcard") update("flashcards");
  else if (type === "quiz") update("quizzes");
 if (stats.documents === 0) {
  stats.flashcards=0;
  stats.quizzes=0;
}

  localStorage.setItem("stats", JSON.stringify(stats));
};