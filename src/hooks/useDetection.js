import { useState, useEffect, useRef } from 'react';
import { detectionService } from '../services/detection';

export const useDetection = (videoRef, options = {}) => {
  const [detections, setDetections] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (options.autoStart) {
      startDetection();
    }

    return () => {
      stopDetection();
    };
  }, [options.autoStart]);

  const startDetection = async () => {
    try {
      setIsDetecting(true);
      setError(null);

      // Initialize model
      await detectionService.initializeModel();

      // Start detection loop
      intervalRef.current = setInterval(async () => {
        if (videoRef?.current) {
          const detectedObjects = await detectionService.detectObjects(videoRef.current);
          setDetections(detectedObjects);
        }
      }, options.interval || 1000);
    } catch (err) {
      setError(err.message);
      setIsDetecting(false);
    }
  };

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    setDetections([]);
  };

  return {
    detections,
    isDetecting,
    error,
    startDetection,
    stopDetection,
  };
};
