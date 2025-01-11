import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Interface for content types
interface Content {
  _id: string;
  title: string;
  type: "video" | "simulation" | "game" | "vr_ar" | "flashcard";
  videoLink?: string;
  thumbnail: string;
  file?: string; // Could be a file for simulation/game/vr/ar
}

const StudentUpload = () => {
  const [contentData, setContentData] = useState<Content>({
    _id: "",
    title: "",
    type: "video", // Default type is video
    videoLink: "",
    thumbnail: "",
    file: "",
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

  // Handle content type change
  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setContentData((prev) => ({ ...prev, type: value as "video" | "simulation" | "game" | "vr_ar" | "flashcard" }));
  };

  // Handle input change for fields like title, video link, etc.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContentData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads for thumbnail and files for simulations, games, etc.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setContentData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", contentData.title);
    formData.append("type", contentData.type);
    if (contentData.videoLink) formData.append("videoLink", contentData.videoLink);
    if (contentData.thumbnail) formData.append("thumbnail", contentData.thumbnail);
    if (contentData.file) formData.append("file", contentData.file);

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
      setUploadedContent((prev) => [...prev, result]); // Update the content list
      setIsUploading(false);
      setContentData({
        _id: "",
        title: "",
        type: "video",
        videoLink: "",
        thumbnail: "",
        file: "",
      }); // Reset the form
    } catch (error) {
      setIsUploading(false);
      console.error("Upload failed:", error);
      alert("An error occurred while uploading the content.");
    }
  };

  return (
    <div>
      <h1>Upload Content (Video, Simulation, Game, VR/AR, Flashcards)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content Type</label>
          <select name="type" onChange={handleContentTypeChange} value={contentData.type}>
            <option value="video">Video</option>
            <option value="simulation">Simulation</option>
            <option value="game">Game</option>
            <option value="vr_ar">VR/AR</option>
            <option value="flashcard">Flashcard</option>
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

        {contentData.type === "video" && (
          <div>
            <label>Embed Video Link</label>
            <input
              type="text"
              name="videoLink"
              value={contentData.videoLink}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div>
          <label>Upload Thumbnail</label>
          <input type="file" name="thumbnail" onChange={handleFileChange} required />
        </div>

        {contentData.type !== "video" && (
          <div>
            <label>Upload {contentData.type.charAt(0).toUpperCase() + contentData.type.slice(1)}</label>
            <input type="file" name="file" onChange={handleFileChange} required />
          </div>
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
            {content.type === "video" && (
              <iframe
                width="560"
                height="315"
                src={content.videoLink}
                title={content.title}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            <img src={content.thumbnail} alt={content.title} width="200" />
            {content.type !== "video" && <p>File: {content.file}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentUpload;
