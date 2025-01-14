import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./css/lessons.css";

interface Content {
  _id: string;
  title: string;
  type: "video" | "simulation" | "game" | "vr_ar";
  link?: string; // For video and simulation
  thumbnail?: string; // For game and VR/AR
  component?: string; // For game (e.g., NumberHunt)
}

const StudentUpload = () => {
  const [contentData, setContentData] = useState<Content>({
    _id: "",
    title: "",
    type: "video", // Default type is video
    link: "",
    thumbnail: "",
    component: "",
  });

  const [uploadedContent, setUploadedContent] = useState<Content[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch uploaded content from backend
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/content", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data: Content[] = await response.json();
      setUploadedContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setContentData((prev) => ({
      ...prev,
      type: value as Content["type"],
      link: "",
      thumbnail: "",
      component: "",
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setContentData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", contentData.title);
    formData.append("type", contentData.type);

    if (contentData.type === "video" || contentData.type === "simulation") {
      formData.append("link", contentData.link || "");
    } else if (contentData.type === "game") {
      formData.append("thumbnail", contentData.thumbnail || "");
      formData.append("component", contentData.component || "");
    }

    try {
      setIsUploading(true);
      const response = await fetch("http://localhost:4000/api/upload-content", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const result = await response.json();
      setUploadedContent((prev) => [...prev, result]);
      setIsUploading(false);
      setContentData({
        _id: "",
        title: "",
        type: "video",
        link: "",
        thumbnail: "",
        component: "",
      });
    } catch (error) {
      setIsUploading(false);
      console.error("Upload failed:", error);
      alert("An error occurred while uploading the content.");
    }
  };

  return (
    <div>
      <h1>Upload Content for Students</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content Type</label>
          <select name="type" onChange={handleContentTypeChange} value={contentData.type}>
            <option value="video">Video</option>
            <option value="simulation">Simulation</option>
            <option value="game">Game</option>
          </select>
        </div>

        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={contentData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Link input for video and simulation */}
        {(contentData.type === "video" || contentData.type === "simulation") && (
          <div>
            <label>Link</label>
            <input
              type="text"
              name="link"
              value={contentData.link}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Thumbnail and component for games */}
        {contentData.type === "game" && (
          <>
            <div>
              <label>Upload Thumbnail</label>
              <input type="file" name="thumbnail" onChange={handleFileChange} required />
            </div>
            <div>
              <label>Game Component</label>
              <input
                type="text"
                name="component"
                value={contentData.component}
                onChange={handleInputChange}
                placeholder="e.g., NumberHunt"
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Content"}
        </button>
      </form>

      <h2>Uploaded Content</h2>
      <ul>
        {uploadedContent.map((content) => (
          <li key={content._id}>
            <h3>{content.title}</h3>
            {content.link && (
              <p>
                Link:{" "}
                <a href={content.link} target="_blank" rel="noopener noreferrer">
                  {content.link}
                </a>
              </p>
            )}
            {content.type === "game" && (
              <>
                <p>Component: {content.component}</p>
                <img
                  src={`http://localhost:4000${content.thumbnail}`}
                  alt={content.title}
                  width="200"
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentUpload;
