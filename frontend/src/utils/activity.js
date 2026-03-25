export const saveActivity=(type,message)=>{

 console.log("saveActivity called",type,message);
  const activities=JSON.parse(localStorage.getItem("recentActivity")) || [];
   
const newActivity={
    id: Date.now(),
    type,
    message,
    time:new Date().toLocaleString()

    
};
const updated=[newActivity,...activities];

localStorage.setItem(
    "recentActivity",
    JSON.stringify(updated.slice(0,20))
);
};