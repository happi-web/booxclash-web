import { useState, useEffect } from "react";

const Videos = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/content/video");
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        setVideos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getYouTubeEmbedLink = (url: string) => {
    if (!url) {
      return ''; // Return an empty string if the URL is not provided
    }

    let videoId = '';
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]*\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    if (match && match[1]) {
      videoId = match[1]; // Extract video ID
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''; // Return the embed link or an empty string if not valid
  };

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div>
      <h2>Videos</h2>
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <div className="videos-list">
          {videos.map((video: any) => (
            <div key={video._id} className="video-card">
              {/* Embed the YouTube video directly */}
              <iframe
                src={
                  currentVideoId === video._id
                    ? getYouTubeEmbedLink(video.link) + "?autoplay=1"
                    : getYouTubeEmbedLink(video.link)
                }
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ width: "100%", height: "300px" }}
              ></iframe>
              {currentVideoId !== video._id && (
                <button onClick={() => setCurrentVideoId(video._id)}>
                  Play Video
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
