import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
});

const flashcardSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    cards: [cardSchema], //  pura array store hoga

  },
  {
    timestamps: true // createdAt, updatedAt auto
  }
);

const Flashcard =
  mongoose.models.Flashcard ||
  mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;