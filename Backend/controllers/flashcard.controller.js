import Flashcard from "../models/Flashcard.js";

// Get all flashcard sets for the logged-in user
export const getAllFlashcardSets = async (req, res) => {
  try {
    const sets = await Flashcard.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: sets });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// Get a single flashcard set by its ID
export const getFlashcardSetById = async (req, res) => {
  try {
    const { setId } = req.params;

    const set = await Flashcard.findOne({
      _id: setId,
      userId: req.user.id,
    });

    if (!set) {
      return res.status(404).json({
        success: false,
        message: "Flashcard set not found",
      });
    }

    res.json({
      success: true,
      data: set,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching flashcard set",
    });
  }
};

// Get all flashcard sets belonging to a specific document
export const getFlashcardsByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const sets = await Flashcard.find({
      documentId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: sets });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching flashcards",
    });
  }
};

// Delete a flashcard set
export const deleteFlashcardSet = async (req, res) => {
  try {
    const { setId } = req.params;

    const deleted = await Flashcard.findOneAndDelete({
      _id: setId,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Flashcard not found",
      });
    }

    res.json({
      success: true,
      message: "Flashcard deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting flashcard",
    });
  }
};