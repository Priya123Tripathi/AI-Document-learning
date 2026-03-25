import mongoose from "mongoose";

const quizschema= new mongoose.Schema(
 {
  documentId :{
    type : mongoose.Schema.Types.ObjectId,
    required: [true, "id is required"],
       ref: "Document",

  },
   questions :[
        {
            question:{
                type: String,
                required: true
},
   options: {
  type: [String],
  required: true,
  validate: {
    validator: function (val) {
      return val.length === 4;
    },
    message: "Each question must have exactly 4 options"
  }
},
      correctAnswer: {
  type: String,
  required: true,
  validate: {
    validator: function (value) {
      return this.options.includes(value);
    },
    message: "Correct answer must be one of the options"
  }
}         

        }
    ],    

      score: {
   type: Number,
   default: 0
},

 totalQuestions: {
    required: true,
   type: Number
},

isCompleted:
 { type: Boolean, default: false }
  },
  { timestamps: true }

)
export default mongoose.model("Quiz" , quizschema);