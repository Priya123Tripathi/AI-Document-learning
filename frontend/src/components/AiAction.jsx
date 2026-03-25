import { useState } from "react";
import axios from "axios";
import { saveActivity } from "../utils/activity";
import { BsStars } from "react-icons/bs";

export default function AiAction({documentId, token }) {

const [concept, setConcept] = useState("");
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [modalText, setModalText] = useState("");
const [modalTitle, setModalTitle] = useState("");
const [explanation ,setExplanation]=useState("");
const[summary,setSummary]=useState("");
const handleSummarize = async () => {
  saveActivity("Summery", "Generated a summery");
  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:8000/api/ai/ai-action",
      { documentId,type:"summary" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );


 setSummary(res.data.answer);
 setModalTitle("Document Summary");
setModalText(res.data.answer);
setShowModal(true);

  } catch (err) {
    console.error("Summary error:", err);
  }

  setLoading(false);
};


const handleExplain = async () => {
  saveActivity("Explain", "Asked about a doubt");
  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:8000/api/ai/ai-action",
      {
        documentId,
        type:"explain",
             concept
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

   
    setExplanation(res.data.answer);
    setModalTitle(`Explanation of "${concept}"`);
setModalText(res.data.answer);
setShowModal(true);

  } catch (err) {
    console.error("Explain error:", err);
  }

  setLoading(false);
};

return(
<div className="bg-white rounded-lg shadow p-6 h-[80vh] overflow-y-auto">

<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
  <span className="bg-green-600 p-2 rounded flex items-center justify-center">
    <BsStars className="text-white text-lg" />
  </span>
  AI Actions
</h2>

<br />
<h3 className=" font-semibold mb-4">Generate summery of Document data</h3>

{/* Generate Summary */}
<div className="border rounded-lg p-4 mb-6">
<h3 className=" mb-2">Generate Summary</h3>

<button
onClick={handleSummarize}
className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
Summarize
</button>

{loading && <p className="mt-2 text-gray-500">Generating summary...</p>}

</div>


{/* Explain Concept */}
<h2 className="font-semibold mb-4">Ask any concept </h2>

<div className="border rounded-lg p-4">

<h3 className=" mb-2">Explain a Concept</h3>

<div className="flex gap-2">
<input
type="text"
value={concept}
onChange={(e) => setConcept(e.target.value)}
placeholder="Enter concept"
className="border p-2 flex-1 rounded"
/>

<button
onClick={handleExplain}
className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
Explain
</button>
</div>
 
</div>
 {/* show summery or concept */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white w-[600px] max-h-[80vh] rounded-lg shadow-xl flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-3">
        <h2 className="text-lg font-semibold">
          {modalTitle}
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto text-gray-700 whitespace-pre-wrap">
        {modalText}
      </div>

    </div>
  </div>
)}
</div>

);


}