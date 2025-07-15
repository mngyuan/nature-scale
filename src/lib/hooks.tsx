import {useEffect, useRef, useState} from 'react';
import {wakeRAPI} from '@/app/actions';
import {createClient} from '@/lib/supabase/client';

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

export function useStorageAsset(
  bucketName: string,
  filePath: string | null | undefined,
  options: {
    signedUrl?: boolean;
    expiresIn?: number; // seconds, default 3600 (1 hour)
  } = {},
) {
  const {signedUrl = false, expiresIn = 3600} = options;

  const [url, setUrl] = useState<string | null>(null);
  const {loading, setLoading, error, setError} = useUpdateStates();

  useEffect(() => {
    if (!filePath) {
      setUrl(null);
      setError('Empty file path');
      return;
    }

    const getUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        if (signedUrl) {
          // Generate signed URL
          const {data, error} = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filePath, expiresIn);

          if (error) throw error;
          setUrl(data.signedUrl);
        } else {
          // Get public URL
          const {data} = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          setUrl(data.publicUrl);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to get storage URL',
        );
        setUrl(null);
      } finally {
        setLoading(false);
      }
    };

    getUrl();
  }, [filePath, bucketName, signedUrl, expiresIn]);

  return {url, loading, error};
}
