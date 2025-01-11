import React, { useEffect, useState } from 'react';
import axios from 'axios';

type ContentType = 'video' | 'simulation' | 'flashcard' | 'game' | 'vr_ar' | 'profile';

interface ContentDisplayProps {
  selectedContentType: ContentType;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ selectedContentType }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust your API endpoint to match the backend structure
        const response = await axios.get(`http://localhost:4000/api/content/${selectedContentType}`);
        setContent(response.data);
      } catch (err) {
        setError('Error fetching content.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedContentType]);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    switch (selectedContentType) {
      case 'video':
        return <div>{content && <video src={content.videoUrl} controls />}</div>;
      case 'simulation':
        return <div>{content && <div>{content.simulationData}</div>}</div>;
      case 'flashcard':
        return <div>{content && <div>{content.flashcards}</div>}</div>;
      case 'game':
        return <div>{content && <div>{content.gameDetails}</div>}</div>;
      case 'vr_ar':
        return <div>{content && <div>{content.vrArContent}</div>}</div>;
      case 'profile':
        return <div>{content && <div>{content.profileDetails}</div>}</div>;
      default:
        return <div>Please select a valid content type.</div>;
    }
  };

  return <div className="content-display">{renderContent()}</div>;
};

export default ContentDisplay;
