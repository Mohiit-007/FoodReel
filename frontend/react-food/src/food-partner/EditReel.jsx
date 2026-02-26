import React,{useState,useEffect} from "react";
import "../styles/createFood.css";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom";

const EditReel = ()=>{

const navigate = useNavigate();
const {id} = useParams();

const [videoFile,setVideoFile] = useState(null);
const [previewUrl,setPreviewUrl] = useState(null);

const [name,setName] = useState("");
const [description,setDescription] = useState("");


useEffect(()=>{
    fetchReel();
},[id]);

const fetchReel = async()=>{
    try{
        const res = await axios.get(
        `http://localhost:8000/partner/reel/${id}`,
        {withCredentials:true}
    );
        const reel = res.data.reel;
        setName(reel.name);
        setDescription(reel.description);
        setPreviewUrl(reel.video);
    }catch(err){
        console.log(err);
    }
};

const handleFileChange = (e)=>{

const file = e.target.files[0];

if(file){
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
}

};


const handleRemove = (e)=>{
    e.preventDefault();
    setVideoFile(null);
    setPreviewUrl(null);
};


// Submit update
const handleSubmit = async(e)=>{

e.preventDefault();

try{

const formdata = new FormData();

    formdata.append("name",name);
    formdata.append("description",description);

    if(videoFile){
        formdata.append("video",videoFile);
    }

    await axios.put(
    `http://localhost:8000/partner/edit/${id}`,
    formdata,
    {
        withCredentials:true,
        headers:{
            "Content-Type":"multipart/form-data"
        }
    }
);

// go back profile
navigate(-1);

}catch(err){
console.log(err.response?.data || err.message);
}

};


return(

<div className="create-food-page">

<div className="create-food-card">

<h2>Edit Reel</h2>

<p className="sub-text">
Update your reel video and details.
</p>

<form
onSubmit={handleSubmit}
className="food-form"
>


{/* Upload Box */}

<label className="upload-box">

<input
type="file"
accept="video/*"
hidden
onChange={handleFileChange}
/>


{!previewUrl ? (

<div className="upload-inner">

<div className="upload-icon">⬆</div>

<p>Tap to upload or drag and drop</p>

<span>
MP4, WebM, MOV • Up to 100MB
</span>

</div>

) : (

<div className="preview-wrapper">

<video
src={previewUrl}
controls
className="video-preview"
/>

<button
type="button"
className="remove-btn"
onClick={handleRemove}
>
✕
</button>

</div>

)}

</label>



{/* Name */}

<div className="form-group">

<label>Name</label>

<input
type="text"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

</div>



{/* Description */}

<div className="form-group">

<label>Description</label>

<textarea
rows="4"
value={description}
onChange={(e)=>setDescription(e.target.value)}
required
/>

</div>


{/* Button */}

<button
type="submit"
className="save-btn"
>
Update Reel
</button>


</form>

</div>

</div>

);

};

export default EditReel;