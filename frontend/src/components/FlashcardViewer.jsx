import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";



export default function FlashcardViewer() {

  const {setId} =useParams();

  const navigate=useNavigate();
  const [cards, setCards] = useState([]);
const [index, setIndex] = useState(0);
const [flip, setFlip] = useState(false);

const token =localStorage.getItem("token");
useEffect(() => {
  const fetchSet = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/flashcards/set/${setId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!data || !data.data) {
        console.log("API error:", data);
        return;
      }

      setCards(data.data.cards);
      setIndex(0);
      setFlip(false);

    } catch (err) {
      console.log(err);
    }
  };

  fetchSet();
}, [setId,token]);

const next = () => {
  if (index < cards.length - 1) {
    setIndex(index + 1);
    setFlip(false);
  }
};

const prev = () => {
  if (index > 0) {
    setIndex(index - 1);
    setFlip(false);
  }
};

if(cards.length === 0){
  return <div className="p-6 flex flex-col items-center justify-center">No flashcards found</div>
}

return (

  <>
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

    

<div className="p-6">

{/* Back button */}

<button
onClick={()=>navigate(-1)}
className="text-gray-600 hover:text-black mb-6"
>  
← Back to Sets
</button>

<div className="flex justify-center items-center w-full ">
<div className="relative w-[700px] h-[260px] perspective cursor-pointer">

  {/* Star */}
  <button
    onClick={(e) => e.stopPropagation()}
    className="absolute top-4 left-4 text-2xl text-yellow-400 z-50"
  >
    ★
  </button>

  {/* Flashcard */}
  <div
    onClick={() => setFlip(!flip)}
    className={` justify-center display-flex relative w-full h-full transition-transform duration-500 transform-3d ${
      flip ? "rotate-y-180" : ""
    }`}
  >


    {/* Question */}
    <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl border rounded-xl bg-white shadow-md px-10 text-center">
      {cards[index]?.question}
    </div>

    {/* Answer */}
    <div className="bg-green-600 absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center text-xl border rounded-xl shadow-md px-10 text-center text-white">
      {cards[index]?.answer}
    </div>
  </div>
</div>
</div>
{/* Navigation */}

<div className=" justify-center flex items-center gap-6 mt-10">

<button
onClick={prev}
disabled={index === 0}
className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
>
Previous
</button>

<span className="text-gray-600 font-medium">
{index + 1} / {cards.length}
</span>

<button
onClick={next}
disabled={index === cards.length - 1}
className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
>
Next
</button>

</div>

</div>
</div>
</div>

  </>

);

}