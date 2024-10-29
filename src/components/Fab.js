import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAppState } from "../utils/contextAPI";
import { TouchableOpacity } from "react-native-gesture-handler";

const Fab = () => {
  const { data, setData } = useAppState();
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const isOpen = useSharedValue(false);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0)
  );
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  function generateRandomNutrition() {
    const calories = Math.floor(Math.random() * (500 - 100 + 1)) + 100; // Random value between 100 and 500
    const fat = Math.floor(Math.random() * (30 - 1 + 1)) + 1; // Random value between 1 and 30
    const protein = Math.floor(Math.random() * (30 - 1 + 1)) + 1; // Random value between 1 and 30
    return {
      calories,
      fat,
      protein,
    };
  }

  const sendImageToGeminiAPI = async (imageUri) => {
    //   return generateRandomNutrition();
    const apiKey = "AIzaSyADKaIvZXJR1nHGBVHRlLbBRrq1rNzgjuk";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const img = {
        inlineData: {
          data: await fetchImageDataAsBase64(imageUri),
          mimeType: "image/jpeg",
        },
      };
      const prompt =
        'Analyze the image of food and provide the estimated value of the food according to use just estimate it in a JSON response with the following format: {"calories": <number>, "fat": <number>, "protein": <number>}';

      const result = await model.generateContent([img, prompt]);
      const response = await result.response;
      const text = await response.text();

      console.log("API Response:", text);

      try {
        const jsonResponse = JSON.parse(text);
        const { calories, fat, protein } = jsonResponse;
        return { calories, fat, protein };
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Received response text:", text);
        return null;
      }
    } catch (error) {
      console.error("Error sending image to Gemini API:", error);
      return null;
    }
  };

  const fetchImageDataAsBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error("Error fetching image data:", error);
      return null;
    }
  };
  const pickImage = useCallback(async () => {
    // console.log("Pick Image");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const now = new Date();
        const nutritionData = await sendImageToGeminiAPI(result.assets[0].uri);

        if (nutritionData) {
          const { calories, fat, protein } = nutritionData;

          const newImage = {
            id: Date.now().toString(),
            date: formatDate(now),
            time: formatTime(now),
            calories,
            fat,
            protein,
            image: result.assets[0].uri,
          };
          setData((prevData) => [newImage, ...prevData]);
        } else {
          console.error("Error: Nutrition data is undefined");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }, []);

  const pickImageFromCamera = useCallback(async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const now = new Date();
        const nutritionData = await sendImageToGeminiAPI(result.assets[0].uri);

        if (nutritionData) {
          const { calories, fat, protein } = nutritionData;

          const newImage = {
            id: Date.now().toString(),
            date: formatDate(now),
            time: formatTime(now),
            calories,
            fat,
            protein,
            image: result.assets[0].uri,
          };
          setData((prevData) => [newImage, ...prevData]);
        } else {
          console.error("Error: Nutrition data is undefined");
        }
      }
    } catch (error) {
      console.error("Error picking image from camera:", error);
    }
  }, []);

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstValue.value = withTiming(30, config);
      secondValue.value = withDelay(50, withTiming(30, config));
      thirdValue.value = withDelay(100, withTiming(30, config));
    } else {
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
      thirdValue.value = withSpring(290);
    }
    isOpen.value = !isOpen.value;
  };

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 210],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: thirdValue.value,
      transform: [{ scale: scale }],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });
  const [showButtons, setShowButtons] = useState(false);
  return (
    // <View style={styles.container}>
    //   <Pressable
    //     onPress={() => {
    //       console.log("Pressed Button 1", count);
    //       setCount((prev) => prev + 1);
    //     }}
    //   >
    //     <Animated.View
    //       style={[styles.contentContainer, thirdIcon]}
    //       onPress={() => {
    //         console.log("Pressed Button 2", count);
    //         setCount((prev) => prev + 1);
    //       }}
    //     >
    //       <View style={styles.iconContainer}>
    //         <Image
    //           source={require("../../assets/gallery.png")}
    //           style={styles.icon}
    //         />
    //       </View>
    //     </Animated.View>
    //   </Pressable>
    //   <Pressable onPress={pickImageFromCamera}>
    //     <Animated.View style={[styles.contentContainer, secondIcon]}>
    //       <View style={styles.iconContainer}>
    //         <Image
    //           source={require("../../assets/camera.png")}
    //           style={styles.icon}
    //         />
    //       </View>
    //     </Animated.View>
    //   </Pressable>
    //   <Animated.View style={[styles.contentContainer, firstIcon]}>
    //     <View style={styles.iconContainer}>
    //       <Image
    //         source={require("../../assets/gallery.png")}
    //         style={styles.icon}
    //       />
    //     </View>
    //   </Animated.View>
    //   <Pressable style={styles.contentContainer} onPress={handlePress}>
    //     <Animated.View style={[styles.iconContainer, plusIcon]}>
    //       <Image source={require("../../assets/add.png")} style={styles.icon} />
    //     </Animated.View>
    //   </Pressable>
    // </View>
    <View style={styles.container}>
      {showButtons && (
        <>
          <View style={styles.iconContainer2}>
            <Pressable
              style={styles.contentContainer}
              onPress={pickImageFromCamera}
              onMagicTap={pickImageFromCamera}
            >
              <Image
                source={require("../../assets/camera.png")}
                style={styles.icon}
              />
            </Pressable>
          </View>
          <View style={styles.iconContainer2}>
            <Pressable
              style={styles.contentContainer}
              onPress={pickImage}
              onMagicTap={pickImage}
            >
              <Image
                source={require("../../assets/gallery.png")}
                style={styles.icon}
              />
            </Pressable>
          </View>
        </>
      )}
      <View style={styles.iconContainer2}>
        <Pressable
          style={styles.contentContainer}
          onPress={() => setShowButtons(!showButtons)}
          onMagicTap={pickImage}
        >
          <Image
            source={require("../../assets/add.png")}
            style={{
              transform: [{ rotate: showButtons ? "45deg" : "0deg" }],
              width: 30,
              height: 30,
              tintColor: "white",
              duration: 500,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: "flex",
    flexDirection: "col",
    gap: 50,
  },
  iconContainer2: {
    padding: 10,
  },
  contentContainer: {
    backgroundColor: "#000",
    position: "absolute",
    bottom: 30,
    right: 30,
    borderRadius: 50,
    padding: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
});
