import {useEffect, useRef, useState} from 'react';
import {wakeRAPI} from '@/app/actions';

export const useMeasuredElement = () => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageDimensions = useRef<{width: number; height: number}>({
    width: 0,
    height: 0,
  });

  const updateImageDimensions = () => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      imageDimensions.current.width = rect.width;
      imageDimensions.current.height = rect.height;
    }
  };

  useEffect(() => {
    updateImageDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateImageDimensions();
    });
    if (imageContainerRef.current) {
      resizeObserver.observe(imageContainerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return {
    ref: imageContainerRef,
    dimensions: imageDimensions.current,
  };
};

export const useUpdateStates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Clear either if the other is set
  useEffect(() => {
    if (error != null) {
      if (message != null) {
        setMessage(null);
      }
    } else if (message != null) {
      if (error != null) {
        setError(null);
      }
    }
  }, [error, message]);

  // Clear on loading
  useEffect(() => {
    if (loading) {
      setError(null);
      setMessage(null);
    }
  }, [loading]);

  return {
    loading,
    setLoading,
    error,
    setError,
    message,
    setMessage,
  };
};

type APIResponseType = Awaited<ReturnType<typeof wakeRAPI>>;

export const useAPIStatus = () => {
  const [apiResponse, setAPIResponse] = useState<APIResponseType>({
    apiStatus: 'loading',
    apiStatusReason: '',
  });

  const {apiStatus, apiStatusReason, httpCode, httpBody} = apiResponse;

  const fetchAPIStatus = async () => {
    if (document && document.hidden) {
      return;
    }
    setAPIResponse({apiStatus: 'loading', apiStatusReason: ''});
    const response = await wakeRAPI();
    setAPIResponse({...response});
  };

  useEffect(() => {
    fetchAPIStatus();
    const intervalID = setInterval(fetchAPIStatus, 60 * 1000);
    return () => clearInterval(intervalID);
  }, []);

  return {
    apiStatus,
    apiStatusReason,
    httpCode,
    httpBody,
    fetchAPIStatus,
  };
};
