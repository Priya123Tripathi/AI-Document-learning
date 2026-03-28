import { useState } from "react";
import { saveActivity } from "../utils/activity";
import API from "../api";

export default function ChatBox({ documentId, token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    saveActivity("Chat", "Asked about the doubt through chatbox");

    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post(
        `/api/ai/ai-action`,
        { documentId, question: input, type: "chat" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMsg = {
        text: res.data.answer || "No answer received from AI.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (error) {
      const errorText =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 400
          ? "This document may not have extracted text yet. Try re-uploading."
          : "Could not get AI response.");

      setMessages((prev) => [
        ...prev,
        { text: `Error: ${errorText}`, sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100vh] md:h-[80vh] bg-white rounded-xl shadow p-3 md:p-4">

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[85%] text-sm md:text-base ${
              msg.sender === "user"
                ? "bg-green-100 ml-auto text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            <p className="text-gray-800 whitespace-pre-line">
              {msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-400">Typing...</div>
        )}

      </div>

      {/* Input Box */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 border-t pt-3">

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about this document..."
          className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 w-full"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full md:w-auto transition-all duration-200"
        >
          {loading ? "..." : "Send"}
        </button>

      </div>
    </div>
  );
}