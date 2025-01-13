import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./css/lessons.css";

interface Content {
  _id: string;
  title: string;
  type: "video" | "simulation" | "game" | "vr_ar" | "flashcard";
  link?: string;
  thumbnail: string | File;
  file?: string | File;
}

const StudentUpload = () => {
  const [contentData, setContentData] = useState<Content>({
    _id: "",
    title: "",
    type: "video",
    link: "",
    thumbnail: "",
    file: "",
  });
  const [uploadedContent, setUploadedContent] = useState<Content[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setContentData((prev) => ({ ...prev, type: value as Content["type"] }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setContentData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", contentData.title);
    formData.append("type", contentData.type);

    // Append link for all applicable types
    if (contentData.link) {
      formData.append("link", contentData.link);
    }

    // Append thumbnail
    if (contentData.thumbnail instanceof File) {
      formData.append("thumbnail", contentData.thumbnail);
    } else {
      console.error("Thumbnail is not a File");
    }

    // Append file for flashcards
    if (contentData.type === "flashcard" && contentData.file instanceof File) {
      formData.append("file", contentData.file);
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

      // Reset form
      setContentData({
        _id: "",
        title: "",
        type: "video",
        link: "",
        thumbnail: "",
        file: "",
      });
    } catch (error) {
      setIsUploading(false);
      console.error("Upload failed:", error);
      alert("An error occurred while uploading the content.");
    }
  };

  return (
    <div>
      <h1>Upload Content</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content Type</label>
          <select name="type" value={contentData.type} onChange={handleContentTypeChange}>
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

        {contentData.type !== "flashcard" && (
          <div>
            <label>Content Link</label>
            <input
              type="text"
              name="link"
              value={contentData.link || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div>
          <label>Upload Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            required
          />
        </div>

        {contentData.type === "flashcard" && (
          <div>
            <label>Upload Flashcard File</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Content"}
        </button>
      </form>

      <h2>Uploaded Content</h2>
      <ul className="lesson-plan-row">
        {uploadedContent.map((content) => (
          <li key={content._id} className="lesson-plan-item">
            <h3>{content.title}</h3>
            {content.link && (
              <p>
                <strong>Link:</strong>{" "}
                <a href={content.link} target="_blank" rel="noopener noreferrer">
                  {content.link}
                </a>
              </p>
            )}
            <img
              src={`http://localhost:4000${content.thumbnail}`}
              alt={content.title}
              width="200"
            />
            {content.type === "flashcard" && content.file && (
              <p>
                <strong>Flashcard File:</strong>{" "}
                <a href={`http://localhost:4000${content.file}`} download>
                  Download
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentUpload;


