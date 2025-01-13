import { useState, useEffect } from 'react';

const VRAR = () => {
  const [vrar, setVrar] = useState<any[]>([]); // State to store fetched VR/AR content
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch VR/AR data when the component mounts
  useEffect(() => {
    const fetchVrar = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/content/vr_ar'); // Endpoint for VR/AR content
        if (!response.ok) {
          throw new Error('Failed to fetch VR/AR content');
        }
        const data = await response.json();
        setVrar(data); // Store VR/AR content in state
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching VR/AR content:', error);
        setLoading(false);
      }
    };

    fetchVrar();
  }, []);

  if (loading) {
    return <div>Loading VR/AR content...</div>;
  }

  return (
    <div>
      <h2>VR/AR</h2>
      {vrar.length === 0 ? (
        <p>No VR/AR content available.</p>
      ) : (
        <div className="vrar-list">
          {vrar.map((content: any) => (
            <div key={content._id} className="vrar-card">
              <img
                src={`http://localhost:4000${content.thumbnail}`}
                alt={content.title}
                className="vrar-thumbnail"
              />
              <h3>{content.title}</h3>
              <button
                onClick={() => {
                  window.open(content.videoLink, '_blank');
                }}
              >
                Play VR/AR Content
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VRAR;
