import { useState } from "react";
import axios from "axios";
import { saveActivity } from "../utils/activity";

export default function ChatBox({ documentId, token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
saveActivity("Chat", "Asked about the doubt through chatbox");
    if (!input.trim()) {
      console.warn(" Empty input — skipping send");
      return;
    }
  

 
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending chat request →", {
        documentId,
        question: input,
      });

      const res = await axios.post(
        "http://localhost:8000/api/ai/ai-action",
        { documentId, question: input , type:"chat"}, //  correct field names
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
      console.error(" Chat error:", error);
   const errorText =
  error.response?.data?.message ||
  error.response?.data?.error ||
  (error.response?.status === 400
    ? "This document may not have extracted text yet. Try re-uploading."
    : "Could not get AI response.");


      setMessages((prev) => [
        ...prev,
        { text: ` Error: ${errorText}`, sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow p-4">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-green-100 ml-auto text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-3 border-t pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about this document..."
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
