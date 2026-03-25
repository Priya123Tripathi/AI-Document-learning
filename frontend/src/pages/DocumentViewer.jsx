import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import Quiz from "../components/Quiz";
import AiAction from "../components/AiAction";
import Flashcard from "../components/Flashcard";


export default function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [doc, setDoc] = useState(location.state || null);
  const [activeTab, setActiveTab] = useState("Content");

  //  Fetch document from backend if refreshed
  useEffect(() => {
      console.log(" useEffect triggered with:", { doc, id, token });
    if (!doc && id && token) {
    
      axios
        .get("http://localhost:8000/api/documents", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
             console.log(" Documents from API →", res.data.documents);
          const found = res.data.documents.find((d) => d._id === id);
          if (found) {
            setDoc({
              ...found,
              fileURL: `http://localhost:8000${found.filePath}`,
            });
          }
        })
        .catch((err) => console.error("Error fetching document:", err));
    }
  }, [doc, id, token]);

  if (!doc)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading document...
      </div>
    );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <Navbar />


        {/* Tabs */}
        <div className="flex border-b bg-white px-8">
          {["Content", "Chat", "AI Actions", "Flashcards", "Quizzes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-green-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-gray-100 p-6">
          {activeTab === "Content" && (
            <div className="bg-white rounded-lg shadow p-4 h-[80vh]">
              <iframe
                src={doc.fileURL || `http://localhost:8000${doc.filePath}`}
                title={doc.title}
                className="w-full h-full border-none rounded"
              ></iframe>
            </div>
          )}

  

{activeTab === "Chat" && (
  <div className="p-6">
    {doc ? (
      <>
        {console.log(" Chat props →", { documentId: doc._id || id, token })}
        <ChatBox documentId={doc._id || id} token={token} />
      </>
    ) : (
      <div className="text-gray-500 text-center py-10">
         Loading document details...
      </div>
    )}
  </div>
)}
          {activeTab === "AI Actions" && (
                   <div className="bg-white rounded-lg shadow p-6 text-gray-700 h-[80vh]">
        {doc?(
          <> <AiAction documentId={doc._id||id} token={token} />
                      </>
        ):(
      <div className="text-gray-500 text-center py-10">
         Loading  Ai Action
      </div>
        )

        }
        
            </div>
          )}

          {activeTab === "Flashcards" && (
          <div className="bg-white rounded-lg shadow p-6 text-gray-700 h-[80vh]">
        {doc?(
          <> <Flashcard documentId={doc._id||id} token={token} />
                      </>
        ):(
      <div className="text-gray-500 text-center py-10">
           Loading.... FlashCard
      </div>
        )
        }
        
            </div>
          )}

          {activeTab === "Quizzes" && (
            <div className="bg-white rounded-lg shadow p-6 text-gray-700 h-[80vh]">
        {doc?(
          <> <Quiz documentId={doc._id||id} token={token} doc={doc}/>
                      </>
        ):(
      <div className="text-gray-500 text-center py-10">
         Loading document details...
      </div>
        )

        }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
