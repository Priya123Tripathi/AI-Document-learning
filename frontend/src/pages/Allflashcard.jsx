import { useEffect } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate} from "react-router-dom";
import { BsCreditCard2Back } from "react-icons/bs";


import Navbar from "../components/Navbar";

export  default function Allflashcard(){
    const [sets, setSets]=useState([]);
    const token=localStorage.getItem("token");
      const navigate=useNavigate();
    useEffect(()=>{
const fetchAll=async()=>{
    const res=await fetch("http://localhost:8000/api/flashcards", {
        headers:{
            Authorization : `Bearer ${token}`
        }
    });
   const data= await res.json();
   setSets(data.data ||[]);

};
  fetchAll();
    },[token]);

return(
<>
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8">
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

{sets.map((set, index) => (
  <div
    key={set._id}                         
    onClick={() =>
      navigate(`/flashcards/view/${set.documentId}/${set._id}`)
    }
    className="relative group bg-white border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
  >
    {/* Top Row */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="bg-green-100 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
          <BsCreditCard2Back size={18} />
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-gray-800">
            Set {index + 1}
          </h3>
          <p className="text-xs text-gray-400">
            Flashcards
          </p>
        </div>
      </div>

  
    </div>

    {/* Middle Info */}
    <div className="mt-5 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">
        {set.cards.length} cards
      </span>

      <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500">
        Study Set
      </span>
    </div>

    {/* Bottom CTA feel */}
    <div className="mt-4 text-sm text-green-600 font-medium opacity-0 group-hover:opacity-100 transition">
      Open →
    </div>
  </div>
))}












</div>
</div>
</div>
</div>
</>
)}