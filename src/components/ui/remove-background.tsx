import { useState, useRef, useEffect } from 'react';

interface BackgroundRemoverProps {
  imageUrl: string;
  threshold?: number; // Color similarity threshold
  backgroundColor?: string; // Color to use for transparent areas
}

const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({ 
  imageUrl, 
  threshold = 150,
  backgroundColor = 'rgba(0,0,0,0)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const removeBackground = (imageElement: HTMLImageElement) => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match image
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw the original image
    ctx.drawImage(imageElement, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Find the background color (assume corner pixel is background)
    const bgPixel = {
      r: data[0],
      g: data[1],
      b: data[2]
    };

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate color difference
      const colorDiff = Math.sqrt(
        Math.pow(r - bgPixel.r, 2) +
        Math.pow(g - bgPixel.g, 2) +
        Math.pow(b - bgPixel.b, 2)
      );

      // If color is similar to background, make transparent
      if (colorDiff <= threshold) {
        data[i + 3] = 0; // Set alpha to 0 (fully transparent)
      }
    }

    // Put modified image data back to canvas
    ctx.putImageData(imageData, 0, 0);

    // Return processed image as data URL
    return canvas.toDataURL();
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Required for canvas to work with external images
    img.src = imageUrl;

    img.onload = () => {
      const processedImageUrl = removeBackground(img);
      if (processedImageUrl) {
        setProcessedImage(processedImageUrl);
      }
    };
  }, [imageUrl, threshold]);

  return (
    <div>
      {processedImage && (
        <div>
          <img 
            src={processedImage} 
            alt="Background Removed" 
            style={{ maxWidth: '100%' }} 
          />
          <canvas 
            ref={canvasRef} 
            style={{ display: 'none' }} 
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;

// Example usage:
// <BackgroundRemover 
//   imageUrl="https://example.com/your-image.jpg" 
//   threshold={150} 
// />