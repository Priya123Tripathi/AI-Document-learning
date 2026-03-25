import mongoose from "mongoose";

const quizResultSchema=new mongoose.Schema(
    {
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"User",
        required:true
      },

         quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
 
    score: Number,

    totalQuestions: Number,

  answers:[
    {
        questionIndex:Number,
        selected:String,
        correctAnswer:String,
        isCorrect:Boolean,
    },
  ],



    },
    {timestamps :true}
);
export default mongoose.model("QuizResult",quizResultSchema);