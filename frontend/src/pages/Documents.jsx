import { useState, useEffect } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";
import { MdOutlineQuiz } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveActivity } from "../utils/activity";
import { updateStats } from "../utils/stats";

export default function Documents() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", file: null });

  // fetch documents
  const fetchDocuments = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/documents",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const docs = data.documents || [];

      const updatedDocs = await Promise.all(
        docs.map(async (doc) => {
          // flashcards
          const saved = localStorage.getItem(`flashcards-${doc._id}`);
          const flashcards = saved ? JSON.parse(saved) : [];

          // quizzes
          let quizCount = 0;
          try {
            const res = await axios.get(
              `http://localhost:8000/api/quiz/document/${doc._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            quizCount = res.data.length;
          } catch {
            quizCount = 0;
          }

          return {
            ...doc,
            flashcardCount: flashcards.length,
            quizCount,
          };
        })
      );

      setDocuments(updatedDocs);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (token) fetchDocuments();
  }, [token]);

  // file select
  const handleFileChange = (e) => {
    setNewDoc({ ...newDoc, file: e.target.files[0] });
  };

  // upload
  const handleUpload = async () => {
    if (!newDoc.title || !newDoc.file) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", newDoc.title);
    formData.append("file", newDoc.file);

    try {
      await axios.post(
        "http://localhost:8000/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchDocuments();

      saveActivity("Document", "Uploaded a document");
      updateStats("document", "add");

      setIsModalOpen(false);
      setNewDoc({ title: "", file: null });
    } catch (err) {
      console.log("Upload Error:", err.response?.data || err.message);
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/documents/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDocuments((prev) => prev.filter((doc) => doc._id !== id));

      saveActivity("Document", "Deleted a Document");
      updateStats("document", "remove");
    } catch (err) {
      console.log("Delete Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8">
          {/* header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Documents</h2>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              <FiUpload /> Upload
            </button>
          </div>

          {/* empty state */}
          {documents.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No documents uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() =>
                    navigate(`/documents/${doc._id}`, { state: doc })
                  }
                  className="bg-white rounded-2xl border p-5 hover:shadow-xl transition cursor-pointer relative group"
                >
                  {/* top */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                        <HiOutlineDocumentText size={20} />
                      </div>

                      <div>
                        <h3 className="text-gray-800 font-semibold">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc._id);
                      }}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  {/* stats */}
                  <div className="mt-4 flex justify-between">
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded">
                      <FiBookOpen className="text-green-600" />
                      <span>{doc.flashcardCount || 0}</span>
                      <span className="text-xs text-gray-500">
                        Flashcards
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded">
                      <MdOutlineQuiz className="text-blue-600" />
                      <span>{doc.quizCount || 0}</span>
                      <span className="text-xs text-gray-500">
                        Quizzes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

    <div className="bg-white w-full max-w-lg p-7 rounded-2xl shadow-xl relative">

      {/* Close button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        ✕
      </button>

      {/* Title */}
      <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
        Upload Document
      </h3>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Enter document title"
        value={newDoc.title}
        onChange={(e) =>
          setNewDoc({ ...newDoc, title: e.target.value })
        }
        className="w-full border border-gray-200 px-4 py-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />

      {/* Upload Box */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-500 hover:bg-green-50 transition">

        <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
          <FiUpload size={20} />
        </div>

        <p className="text-gray-700 font-medium">
          {newDoc.file ? "File selected" : "Upload PDF"}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          {newDoc.file ? newDoc.file.name : "Click to browse"}
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6">

        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          upload
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}