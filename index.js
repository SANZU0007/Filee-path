import React, { useRef, useState } from 'react';

function ImageGenerator() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [imageSrc, setImageSrc] = useState(null);

  const textStyles = [
    {
      color: 'white',
      font: '30px Arial',
      align: 'center',
      offsetY: 0,
    },
    {
      color: 'red',
      font: '24px Times New Roman',
      align: 'left',
      offsetY: 20,
    },
    {
      color: 'blue',
      font: '36px Helvetica',
      align: 'right',
      offsetY: 40,
    },
    {
      color: 'green',
      font: '28px Verdana',
      align: 'center',
      offsetY: -30,
    },
    {
      color: 'orange',
      font: '32px Courier New',
      align: 'center',
      offsetY: 10,
    },
  ];

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const getRandomTextStyle = () => {
    const randomIndex = Math.floor(Math.random() * textStyles.length);
    return textStyles[randomIndex];
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const canvasWidth = 1000;
    const canvasHeight = 1500;

    // Calculate image dimensions to fit within the canvas
    const image = new Image();
    image.src = '/' + Math.floor(Math.random() * 8) + '.png'; // Replace with your image template URL

    image.onerror = () => {
      // Handle the error, e.g., by showing an error message
      console.error('Failed to load the image template.');
    };

    image.onload = () => {
      const aspectRatio = image.width / image.height;
      let imgWidth, imgHeight;

      if (canvasWidth / aspectRatio < canvasHeight) {
        imgWidth = canvasWidth;
        imgHeight = canvasWidth / aspectRatio;
      } else {
        imgWidth = canvasHeight * aspectRatio;
        imgHeight = canvasHeight;
      }

      const imgX = (canvasWidth - imgWidth) / 2;
      const imgY = (canvasHeight - imgHeight) / 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      context.drawImage(image, imgX, imgY, imgWidth, imgHeight);

      const textStyle = getRandomTextStyle();
      context.fillStyle = textStyle.color;
      context.textAlign = textStyle.align;

      const x = canvasWidth / 2;
      const y = canvasHeight - 20 + textStyle.offsetY;

      // Set initial font size
      let fontSize = 100;

      // Function to calculate text dimensions
      function measureTextDimensions(text, fontSize) {
        context.font = `${fontSize}px Arial`;
        const metrics = context.measureText(text);
        return { width: metrics.width, height: fontSize };
      }

      // Function to adjust font size to fit the canvas
      function adjustFontSizeToFitCanvas(text, canvasWidth, canvasHeight) {
        const targetTextWidth = canvasWidth - 40; // Adjust as needed

        let dimensions = measureTextDimensions(text, fontSize);
        while (dimensions.width > targetTextWidth || dimensions.height + y > canvasHeight) {
          fontSize--;
          dimensions = measureTextDimensions(text, fontSize);
        }
        return fontSize;
      }

      // Adjust font size
      fontSize = adjustFontSizeToFitCanvas(text, canvasWidth, canvasHeight);

      // Draw text
      const maxLines = Math.floor((canvasHeight - y) / fontSize);
      const lines = wrapText(text, context, canvasWidth - 40, maxLines);

      // Calculate total height of wrapped text
      const totalTextHeight = lines.length * fontSize;

      // Calculate starting Y position to center text vertically
      const startY = y - totalTextHeight / 2;

      // Draw wrapped text
      lines.forEach((line, index) => {
        context.fillText(line, x, startY + index * fontSize);
      });

      const generatedImageSrc = canvas.toDataURL('image/png');

      setImageSrc(generatedImageSrc);
    };
  }

  function wrapText(text, context, maxWidth, maxLines) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    let lineCount = 0;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth <= maxWidth && (maxLines === undefined || lineCount < maxLines)) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
        lineCount++;
      }
    }

    lines.push(currentLine);
    return lines;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={handleTextChange}
      />
      <button onClick={generateImage}>Generate Image</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {imageSrc && (
        <img
          width="200px"
          height="300px"
          src={imageSrc}
          alt="Generated Image"
        />
      )}
    </div>
  );
}

export default ImageGenerator;
