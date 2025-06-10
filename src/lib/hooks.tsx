import {useEffect, useRef} from 'react';

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
