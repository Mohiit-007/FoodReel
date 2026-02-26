import React, { useState } from "react";
import "../styles/createFood.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFoodPartner = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setVideoFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formdata = new FormData();
      const name = e.target.name.value;
      const description = e.target.description.value;

      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("video", videoFile);

      const res = await axios.post(
        "http://localhost:8000/partner/api/food",
        formdata,
        {
          withCredentials: true,
          headers: {
          "Content-Type": "multipart/form-data",
        },
        }
      );

      console.log(res.data);

      navigate(-1);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
};

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <h2>Create Food</h2>
        <p className="sub-text">
          Upload a short video, give it a name, and add a description.
        </p>

        <form onSubmit={handleSubmit} className="food-form">

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
                <span>MP4, WebM, MOV • Up to 100MB</span>
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

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="e.g. Spicy Paneer Wrap"
              required
              name="name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Write a short description: ingredients, taste, spice level, etc."
              required
              name='description'
            />
          </div>

          <button type="submit" className="save-btn">
            Save Food
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateFoodPartner;