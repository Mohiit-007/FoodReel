import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/userprofile.css";
import { useNavigate } from "react-router-dom";


const Userprofile = () => {
const navigate = useNavigate();

const [reels,setReels] = useState([]);
const [user,setUser] = useState(null);

useEffect(()=>{
 fetchData();
},[]);


const fetchData = async ()=>{

 try{

    const savedRes = await axios.get(
    "http://localhost:8000/partner/saved",
    {withCredentials:true}
    );

    const userRes = await axios.get(
    "http://localhost:8000/partner/user",
    {withCredentials:true}
    );

    setReels(savedRes.data.reels);
    setUser(userRes.data.user);

 }catch(err){
    console.log(err);
 }

};

const logoutUser = async()=>{

try{
    await axios.post(
        "http://localhost:8000/user/logout",
        {},
        {withCredentials:true}
    );
        localStorage.removeItem("fullname");
        localStorage.removeItem("userId");
        navigate("/user/login");
    }catch(err){
       console.log(err);
    }
}


return (

<div className="profile-wrapper">

<div className="profile-bg">
    <div className="profile-card">

<div className="profile-header">

  <div className="profile-left">

    <div className="avatar">
      {user?.fullname?.charAt(0).toUpperCase()}
    </div>

    <div className="profile-info">
      <h2>{user?.fullname}</h2>
      <p className="profile-email">{user?.email}</p>
      <p className="profile-count">
        {reels.length} Saved Reels
      </p>
    </div>

  </div>

  <button
    className="logout-btn"
    onClick={logoutUser}
  >
    Logout
  </button>

</div>

<div className="divider"></div>


{/* SAVED REELS */}

<div className="reels-grid">

{reels.map((reel)=>(
<div className="reel-card" key={reel._id} onClick={()=>navigate('/')}>

<video
src={reel.video}
autoPlay
muted
loop
/>

<div className="reel-overlay">

<p className="reel-title">
{reel.title}
</p>

</div>

</div>
))}

</div>

</div>
    </div>

</div>

);

};

export default Userprofile;