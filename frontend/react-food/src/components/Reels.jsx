import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaBookmark, FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa";
import { RiHome2Line } from "react-icons/ri";
import { PiShareFatBold } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import "../styles/reels.css";

const Reels = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments,setComments] = useState([]);
  const [selectedFood,setSelectedFood] = useState(null);
  const [text,setText] = useState("");
  const [showComments,setShowComments] = useState(false);
  const [shareLink,setShareLink] = useState(null);
  const [editingId,setEditingId] = useState(null);
  const [editText,setEditText] = useState("");
  const [lastFirstId,setLastFirstId] = useState(null);
  
  const userId = localStorage.getItem("userId");
  const fullname = localStorage.getItem("fullname");
  const loggedPartnerId = localStorage.getItem("partnerId")
  const Partnername = localStorage.getItem("name")

  const startEdit = (comment)=>{
    setEditingId(comment._id);
    setEditText(comment.text);
  }

  const shuffleArray = (array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/partner", {
          withCredentials: true,
        });
        const shuffled = shuffleArray(res.data.fooditems);

        if(lastFirstId && shuffled[0]._id === lastFirstId){
          shuffled = shuffleArray(fooditems);
        }
        setVideos(shuffled);
        setLastFirstId(shuffled[0]._id);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

      const handleHomeClick = async()=>{
        await fetchVideos();
        window.scrollTo({
          top:0,
          behavior:"smooth"
        });
      }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    const videoElements = document.querySelectorAll(".reel-video");
      videoElements.forEach((video) => observer.observe(video));

      return () => {
        videoElements.forEach((video) => observer.unobserve(video));
          };
        }, [videos]);

  if (loading) return <div className="loader">Loading Reels...</div>;

    const likecount = async (foodId) => {

      try {
        const res = await axios.post(
          "http://localhost:8000/partner/like",
          { foodId },
          { withCredentials: true }
        );

        setVideos(prev =>
          prev.map(item =>
            item._id === foodId
              ? {
                  ...item,
                  liked: res.data.liked,
                  likecount: res.data.likecount
                }
              : item
          )
        );

      } catch (err) {

        if (err.response?.status === 401) {
          alert("Please login to like ❤️ as User");
          navigate("user/login");
        } else {
          console.log(err);
        }
      }
    };

    const openComments = async(foodId)=>{

      setSelectedFood(foodId);
      setShowComments(true);

      const res = await axios.get(
        `http://localhost:8000/partner/comment/${foodId}`
      );

      setComments(res.data.comments);

    }

    const postComment = async()=>{
      if(!text.trim()){
        alert("Write something first");
        return;
      }

      try{

        await axios.post(
          "http://localhost:8000/partner/comment",
            {
              foodId:selectedFood,
              text
            },
            {
              withCredentials:true
            }
        );

        setText("");

        openComments(selectedFood);
        
        setVideos(prev =>
          prev.map(item =>
          item._id === selectedFood
            ? {
                ...item,
                commentcount: Math.max(0,(item.commentcount || 0) + 1)
              }
            : item
          )
        );

      }catch(err){

        if(err.response?.status === 401){

          alert("Login to comment as User");

          navigate("/user/login");

        }

      }
    }

    const deleteComment = async(commentId)=>{

      try{

        await axios.delete(
        `http://localhost:8000/partner/comment/${commentId}`,
        {
          withCredentials:true
        }
        );

        openComments(selectedFood);
         
        setVideos(prev =>
          prev.map(item =>
          item._id === selectedFood
            ? {
                ...item,
                commentcount: Math.max(0,(item.commentcount || 0) - 1)
              }
            : item
          )
        );

      }catch(err){

        console.log(err);

      }

    }

    const shareReel = async (foodId)=>{
      const link = `${window.location.origin}/?reel=${foodId}`;
      setShareLink(link)
      setSelectedFood(foodId);
    }

    const copyLink = async()=>{

      navigator.clipboard.writeText(shareLink);

      try{

        const res = await axios.post(
        "http://localhost:8000/partner/share",
        {foodId:selectedFood}
        );

        // instant update
        setVideos(prev =>
          prev.map(item =>
          item._id === selectedFood
            ? {...item,sharecount:res.data.sharecount}
            : item
          )
        );

      }catch(err){
        console.log(err);
      }

      setShareLink(null);
    }

    const saveReel = async (foodId)=>{

      try {
        const res = await axios.post('http://localhost:8000/partner/save',{
          foodId
        },{withCredentials : true})

        setVideos(prev=>
          prev.map(item=> item._id === foodId ? {...item,saved:res.data.saved} : item)
        )
      } catch (error) {
        alert('please login first as User');
        navigate('/user/login')
      }
    }

    const timeAgo = (date) => {

      const seconds = Math.floor((new Date() - new Date(date)) / 1000);

      if(seconds < 60) return "Just now";

      const minutes = Math.floor(seconds/60);
      if(minutes < 60) return minutes + "m ago";

      const hours = Math.floor(minutes/60);
      if(hours < 24) return hours + "h ago";

      const days = Math.floor(hours/24);
      return days + "d ago";

      };

      const updateComment = async(id)=>{
        try{
          await axios.put(
          `http://localhost:8000/partner/update/comment/${id}`,
          { text: editText },
          {withCredentials:true}
          );
          setComments(prev =>
            prev.map(c =>
              c._id === id ? {...c, text: editText} : c
            )
          );
          setEditingId(null);

        }catch(err){
          console.log(err);
        }
      }     
      


  return (
    <div className="reels-wrapper">
      <div className="reels-container">
        {videos.map((v) => (
          <section className="reel" key={v._id}>
            
            <video
              src={v.video}
              muted
              loop
              playsInline
              className="reel-video"
            />

            {/* Gradient */}
            <div className="reel-gradient"></div>

            <div className="reel-actions">

            <div className="action-item" onClick={() => likecount(v._id)}>
                {v.liked ? (
                    <FaHeart className="action-icon liked" />
                ) : (
                    <FaRegHeart className="action-icon" />
                )}

                <span className="action-count">
                    {v.likecount || 0}
                </span>
            </div>

            <div className="action-item" onClick={()=>openComments(v._id)}>
                <FaRegComment className="action-icon"/>
                <span>{v.commentcount || 0}</span>
            </div>

            <div className="action-item" onClick={()=>shareReel(v._id)}>
                <PiShareFatBold className="action-icon" />
                <span className="action-count">{v.sharecount || 0}</span>
            </div>

            <div className="action-item" onClick={()=>saveReel(v._id)}>
              {v.saved ? (
              <FaBookmark className="action-icon saved"/>
              ):(
              <FaRegBookmark className="action-icon"/>
              )}
            </div>

            </div>

            {/* Bottom Left Content */}
            <div className="reel-overlay">
              <h4 className="reel-title">{v.name}</h4>
              <p className="reel-desc">{v.description}</p>

              <button
                className="visit-btn"
                onClick={() => navigate(`/partner/${v.foodpartner}`)}
              >
                Visit Store
              </button>
            </div>
          </section>
        ))}
      </div>
      {shareLink && (

      <div className="share-overlay">

        <div className="share-panel">

          <div className="share-header">

            <span>Share Reel</span>

            <span
            className="close-btn"
            onClick={()=>setShareLink(null)}
            >
              ✕
            </span>

          </div>

          <div className="share-body">

            <input
            value={shareLink}
            style={{color:'black'}}
            readOnly
            className="share-input"
            />

            <button
            className="copy-btn"
            onClick={copyLink}
            >
              Copy Link
            </button>

          </div>

        </div>

      </div>

      )}

      {showComments && (
      <div className="comment-overlay">

        <div className="comment-panel">

          {/* Header */}
          <div className="comment-header">

            <span>Comments</span>

            <span
              className="close-btn"
              onClick={()=>setShowComments(false)}
            >
              ✕
            </span>

      </div>


<div className="comment-list">

{comments.map(c => (

<div key={c._id} className="comment-row">

<div className="comment-left">

<div className="comment-avatar">
{c.user?.fullname?.charAt(0)?.toUpperCase() || "U"}
</div>

<div className="comment-content">

<div className="comment-top">

<span className="comment-username">
{c.user?.fullname}
</span>

<span className="comment-time">
{timeAgo(c.createdAt)}
</span>

</div>


{editingId === c._id ? (

<div className="edit-wrapper">

<input
className="edit-input"
value={editText}
style={{background:'#f0f2f5',color:'black'}}
onChange={(e)=>setEditText(e.target.value)}
/>

<button
className="save-btn"
onClick={()=>updateComment(c._id)}
>
Save
</button>

</div>

) : (

<div className="comment-text">
{c.text}
</div>

)}

</div>

</div>


{/* RIGHT SIDE BUTTONS */}

{userId === c.user?._id && (

<div className="comment-actions">

<button
className="edit-btn"
onClick={()=>startEdit(c)}
>
✎
</button>

<button
className="delete-btn"
onClick={()=>deleteComment(c._id)}
>
🗑
</button>

</div>

)}

</div>

))}

</div>


      <div className="comment-input-box">

        <input
          type="text"
          style={{color:'black'}}
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Add a comment..."
        />

        <button onClick={postComment}>
          Post
        </button>

      </div>

    </div>

  </div>
)}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.7px'}} >
            <RiHome2Line onClick={handleHomeClick} style={{color:'white',cursor:'pointer'}} size={27} />
            <p style={{color:'white',fontSize:'12px'}} >Home</p>
        </div>
        
        {
          !fullname && !Partnername &&  ( <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.7px'}} >
            <RxAvatar onClick={()=>navigate('/user/login')} style={{color:'white',cursor:'pointer'}} size={27} />
            <p style={{color:'white',fontSize:'12px'}} >Login</p>
        </div>)
        }

        {
          fullname && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.7px'}} >
            <RxAvatar onClick={()=>navigate('/profile')} style={{color:'white',cursor:'pointer'}} size={27} />
            <p style={{color:'white',fontSize:'12px'}} >{fullname}</p>
           </div>
          )
        }

        {
          Partnername && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.7px'}} >
            <RxAvatar onClick={()=>navigate(`/partner/${loggedPartnerId}`)} style={{color:'white',cursor:'pointer'}} size={27} />
            <p style={{color:'white',fontSize:'12px'}} >{Partnername}</p>
           </div>
          )
        }
      </div>
    </div>
  );
};

export default Reels;