import { useState, useEffect } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";
import { MdOutlineQuiz } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

import { saveActivity } from "../utils/activity";
import { updateStats } from "../utils/stats";
import API from "./api";


export default function Documents() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", file: null });

  const fetchDocuments = async () => {
    try {
      const { data } = await API.get(
        `/api/documents`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDocuments(data.documents || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchDocuments();
  }, [token]);

  const handleFileChange = (e) => {
    setNewDoc({ ...newDoc, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    if (!newDoc.title || !newDoc.file) return;

    const formData = new FormData();
    formData.append("title", newDoc.title);
    formData.append("file", newDoc.file);

    try {
      await API.post(
        `/api/documents/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchDocuments();
      saveActivity("Document", "Uploaded a document");
      updateStats("document", "add");

      setIsModalOpen(false);
      setNewDoc({ title: "", file: null });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await API.delete(
        `/api/documents/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="p-4 md:p-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
            <h2 className="text-lg md:text-2xl font-semibold">
              My Documents
            </h2>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
            >
              <FiUpload /> Upload
            </button>
          </div>

          {/* Empty */}
          {documents.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No documents uploaded
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            {documents.map((doc) => (
              <div
                key={doc._id}
                onClick={() =>
                  navigate(`/documents/${doc._id}`, { state: doc })
                }
                className="bg-white rounded-xl border p-4 md:p-5 hover:shadow-lg transition cursor-pointer relative group"
              >

                {/* Top */}
                <div className="flex justify-between items-start">

                  <div className="flex gap-3">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                      <HiOutlineDocumentText size={18} />
                    </div>

                    <div>
                      <h3 className="text-gray-800 font-semibold text-sm md:text-base">
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
                    className="text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <FiTrash2 size={16} />
                  </button>

                </div>

                {/* Stats */}
                <div className="mt-4 flex justify-between">

                  <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded text-xs">
                    <FiBookOpen className="text-green-600" />
                    {doc.flashcardCount || 0}
                  </div>

                  <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded text-xs">
                    <MdOutlineQuiz className="text-blue-600" />
                    {doc.quizCount || 0}
                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">

          <div className="bg-white w-full max-w-md p-5 md:p-6 rounded-xl shadow-xl relative">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Upload Document
            </h3>

            <input
              type="text"
              placeholder="Enter title"
              value={newDoc.title}
              onChange={(e) =>
                setNewDoc({ ...newDoc, title: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mb-4"
            />

            <div className="flex justify-between">
              <button onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}