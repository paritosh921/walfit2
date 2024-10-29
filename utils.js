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
  const apiKey = 'AIzaSyA49kKnxLWHWd-Pl0RqQOBvG7P3zh6AkH0';
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const img = {
      inlineData: {
        data: await fetchImageDataAsBase64(imageUri),
        mimeType: 'image/jpeg',
      },
    };
    const prompt = 'You will be given an image of food. Analyze the quantity and quality in the image and provide three numbers: Calories, Fat, and Protein. Provide only the numbers in this order: Calories, Fat, Protein. No additional text.';

    const result = await model.generateContent([img, prompt]);
    const response = await result.response;
    const text = await response.text();

    const [calories, fat, protein] = text.split(',').map(item => item.trim());
    return { calories, fat, protein };
  } catch (error) {
    console.error('Error sending image to Gemini API:', error);
  }
};
