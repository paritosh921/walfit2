import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to fetch image data as Base64
export const fetchImageDataAsBase64 = async (imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return base64;
};

// Function to send image to Gemini API
export const sendImageToGeminiAPI = async (imageUri) => {
  const apiKey = ''; // API key
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const img = {
      inlineData: {
        data: await fetchImageDataAsBase64(imageUri),
        mimeType: 'image/jpeg',
      },
    };
    const prompt = '';// Prompt

    const result = await model.generateContent([img, prompt]);
    const response = await result.response;
    const text = await response.text();

    const [calories, fat, protein] = text.split(',').map(item => item.trim());
    return { calories, fat, protein };
  } catch (error) {
    console.error('Error sending image to API:', error);
  }
};
