import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import Quiz from "../components/Quiz";
import AiAction from "../components/AiAction";
import Flashcard from "../components/Flashcard";
import API from "../api";

export default function DocumentViewer() {
  const { id } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [doc, setDoc] = useState(location.state || null);
  const [activeTab, setActiveTab] = useState("Content");

useEffect(() => {
  if (!doc && id && token) {
    API.get(`/api/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const found = res.data.document;

        setDoc({
          ...found,
          fileURL: `${import.meta.env.VITE_API_URL}${found.filePath}`,
        });
      })
      .catch((err) => {
        console.error("Error fetching document:", err);
      });
  }
}, [id, token]);

  if (!doc) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading document...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col">
        <Navbar />

        {/* Tabs */}
        <div className="border-b bg-white px-3 md:px-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {["Content", "Chat", "AI Actions", "Flashcards", "Quizzes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 md:px-4 text-sm md:text-base font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-green-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-100 p-3 md:p-6">

          {/* PDF */}
          {activeTab === "Content" && (
            <div className="bg-white rounded-lg shadow p-3 md:p-4 h-[75vh] md:h-[80vh]">
              <iframe
              src={
  doc.fileURL ||
  `${import.meta.env.VITE_API_URL}${doc.filePath}`
}
                title={doc.title}
                className="w-full h-full rounded"
              />
            </div>
          )}

          {/* Chat */}
          {activeTab === "Chat" && (
            <div className="h-[75vh] md:h-[80vh]">
              <ChatBox documentId={doc._id || id} token={token} />
            </div>
          )}

          {/* AI Actions */}
          {activeTab === "AI Actions" && (
            <div className="bg-white rounded-lg shadow h-[75vh] md:h-[80vh] overflow-hidden">
              <AiAction documentId={doc._id || id} token={token} />
            </div>
          )}

          {/* Flashcards */}
          {activeTab === "Flashcards" && (
            <div className="bg-white rounded-lg shadow h-[75vh] md:h-[80vh] overflow-hidden">
              <Flashcard documentId={doc._id || id} token={token} />
            </div>
          )}

          {/* Quiz */}
          {activeTab === "Quizzes" && (
            <div className="bg-white rounded-lg shadow h-[75vh] md:h-[80vh] overflow-hidden">
              <Quiz documentId={doc._id || id} token={token} doc={doc} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}