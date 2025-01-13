import { useState, useEffect } from "react";

const Simulations = () => {
  const [Simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/content/simulation");
        if (!response.ok) {
          throw new Error("Failed to fetch Simulations");
        }
        const data = await response.json();
        setSimulations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Simulations:", error);
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  const getYouTubeEmbedLink = (url: string) => {
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return <div>Loading Simulations...</div>;
  }

  return (
    <div>
      <h2>Simulations</h2>
      {Simulations.length === 0 ? (
        <p>No Simulations available.</p>
      ) : (
        <div className="Simulations-list">
          {Simulations.map((video: any) => (
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

export default Simulations;
