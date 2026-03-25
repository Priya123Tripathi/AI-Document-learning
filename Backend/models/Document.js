import mongoose from "mongoose";

// Define the Document schema
const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters long"],
      maxlength: [20, "Title cannot exceed 200 characters"],
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader reference is required"],
    },
    textContent: {
  type: String,
  default: "",
},
extractionMethod: {
  type: String,
  enum: ["pdf-parse", "OCR", "error"],
  default: "pdf-parse",
},

  },
  { timestamps: true } // Automatically manages createdAt & updatedAt
);

// Indexing for faster queries by uploader or title
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ title: "text" });



//  Instance method example: check ownership
documentSchema.methods.isOwnedBy = function (userId) {
  return this.uploadedBy.toString() === userId.toString();
};

// Export the model
export default mongoose.model("Document", documentSchema);
