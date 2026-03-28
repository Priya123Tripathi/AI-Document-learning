import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentViewer from "./pages/DocumentViewer";
import QuizViewer from "./pages/QuizViewer";
import Profile from "./pages/Profile";
import FlashcardViewer from "./components/FlashcardViewer";
import QuizScore from  "./pages/QuizScore";
import Allflashcard from  "./pages/Allflashcard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
     <Route path="/dashboard" element={<Dashboard />} />
   <Route path="/documents" element={<Documents />} />
  <Route path="/documents/:id" element={<DocumentViewer />} />
  <Route path="/quizViewer/:id" element={<QuizViewer />} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/flashcards/view/:documentId/:setId"element={<FlashcardViewer />}/>
    <Route path="/quizScore/:resultId" element={<QuizScore />} />
   <Route path="/flashcards" element={<Allflashcard/>}/>
    </Routes>
  );
}

export default App;
