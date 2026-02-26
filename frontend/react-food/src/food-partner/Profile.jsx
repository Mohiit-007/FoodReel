import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/profile.css'

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedPartnerId = localStorage.getItem("partnerId")
  const isOwner = loggedPartnerId === partner?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/partner/${id}`,
          { withCredentials: true }
        );
        console.log(res.data);

        setPartner(res.data.partner);
        setFoods(res.data.foods || []);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading)
    return <div className="profile-loader">Loading...</div>;

  if (!partner)
    return <div className="profile-loader">Partner not found</div>;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    partner.name
  )}&background=0D1117&color=fff&size=256`;

  const logoutUser = async()=>{
  try{
      await axios.post(
          "http://localhost:8000/user/partner/logout",
          {},
          {withCredentials:true}
      );
          navigate("/partner/login");
      }catch(err){
        console.log(err);
      }
  }

  const deleteReel = async (id)=>{
    try{
      const confirmDelete = window.confirm("delete this reel?");

      if(!confirmDelete) return;
      await axios.delete(
        `http://localhost:8000/partner/delete/${id}`,
        {withCredentials:true}
      );

      setFoods(prevFoods =>
        prevFoods.filter(food =>
        food._id !== id
       )
      );

    }
    catch(err){
      console.log(err);
    }
  };  

  return (
    <div className="partner-profile">
      <div className="partner-card">

        <div className="partner-header">

  <img src={avatarUrl} alt="avatar" className="avatar" />

  <div className="partner-info">
    <h2>{partner.name}</h2>
    <p className="address">{partner.address}</p>
    <p className="phone">{partner.phone}</p>

    <div className="stats">
      <strong>{foods.length}</strong>
      <span> Meals</span>
    </div>
  </div>

  {isOwner && (
    <div className="partner-buttons">

    <button
      className="add-reel-btn"
      onClick={() => navigate("/create-food")}
    >
      + Add Reel
    </button>

    <button
      className="partner-logout-btn"
      onClick={logoutUser}
    >
      Logout
    </button>

  </div>
  )}

</div>

  <hr />

  <div className="video-grid">

{foods.map((food) => (

<div
key={food._id}
className="video-tile"
>

<video
src={food.video}
muted
loop
className="grid-video"
autoPlay
onClick={() => navigate("/")}
/>

{isOwner && (
  <>
  <button
      className="delete-reel-btn"
      onClick={(e)=>{
      e.stopPropagation();
      deleteReel(food._id);
      }}
    >
    ✕
    </button>

    <button
      className="edit-reel-btn"
      onClick={()=>navigate(`/edit/${food._id}`)}
      >
    Edit
  </button>
  </>
)}


<div className="video-overlay">
{food.name}
</div>

</div>

))}

</div>

      </div>
    </div>
  );
};

export default Profile;