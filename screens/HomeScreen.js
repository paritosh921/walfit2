import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";




import * as ImagePicker from "expo-image-picker";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TestChart from "../src/components/PieChart";
import Fab from "../src/components/Fab";
import DonutChartContainer from "../src/components/DonutChartContainer";
import { useAppState } from "../src/utils/contextAPI";
// import ChartComponent from "../src/components/PieChart";

// Helper function to format date
const formatDate = (date) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Helper function to format time
const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Dummy data with updated date and time format
const INITIAL_DATA = [
  {
    id: "1",
    date: "23 July 2024",
    time: "07:30 AM",
    image: "https://via.placeholder.com/150",
    calories: "250",
    fat: "10",
    protein: "15",
  },
  // ... (other initial data items with updated format)
];

const HomeScreen = () => {
  const { data, setData } = useAppState();
  const[totalCalories, setTotalCalories] = useState(100);
  const[totalFat, setTotalFat] = useState(50);
  const[totalProtein, setTotalProtein] = useState(60);
  // add all and save here
  useEffect(() => {
    setTotalCalories(
      data.reduce((acc, item) => acc + Number(item.calories), 0)
    );
    setTotalFat(data.reduce((acc, item) => acc + Number(item.fat), 0));
    setTotalProtein(data.reduce((acc, item) => acc + Number(item.protein), 0));
  }, [data]);

  // useEffect(() => {
  //   console.log(
  //     `Total Calories: ${totalCalories}, Total Fat: ${totalFat}, Total Protein: ${totalProtein}`
  //   );
  // }, [totalCalories, totalFat, totalProtein]);
  const handleDelete = useCallback((id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  }, []);

  const pickImage = useCallback(async () => {
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

  const sendImageToGeminiAPI = async (imageUri) => {
    const apiKey = "AIzaSyA49kKnxLWHWd-Pl0RqQOBvG7P3zh6AkH0";
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

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item.date}</Text>
          <Text style={styles.text}>Time: {item.time}</Text>
          <Text style={styles.text}>Calories: {item.calories}</Text>
          <Text style={styles.text}>Fat: {item.fat}</Text>
          <Text style={styles.text}>Protein: {item.protein}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <View style={styles.deleteText}>
            <Text style={styles.deleteText}>🗑</Text>
          </View>
        </TouchableOpacity>
      </View>
    ),
    [handleDelete]
  );

  const calculateTotals = (data) => {
    let totalCalories = 0;
    let totalFat = 0;
    let totalProtein = 0;

    data.forEach((item) => {
      totalCalories += parseInt(item.calories, 10);
      totalFat += parseInt(item.fat, 10);
      totalProtein += parseInt(item.protein, 10);
    });

    return { totalCalories, totalFat, totalProtein };
  };

  const totals = calculateTotals(data);

  const chartData = [
    {
      key: 1,
      value: totals.totalCalories,
      svg: { fill: "#479BD8" },
    },
    {
      key: 2,
      value: totals.totalFat,
      svg: { fill: "#67D49E" },
    },
    {
      key: 3,
      value: totals.totalProtein,
      svg: { fill: "#D9B85A" },
    },
  ];


  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <DonutChartContainer data={chartData} />
      </View>
      {/* <View style={styles.curvedLine} /> */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={21}
        contentContainerStyle={styles.listContainer}
      />
      <View>
        <Fab style={styles.cameraIcon}></Fab>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const CURVE_HEIGHT = 50;

const styles = StyleSheet.create({
  icon:{
    width: 40,
    height: 40,
  },
  graphContainer: {
    height: "40%",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: CURVE_HEIGHT / 2,
    borderTopRightRadius: CURVE_HEIGHT / 2,
  },
  emptySection: {
    backgroundColor: "#ffb580",
    justifyContent: "center",
    alignItems: "center",
  },
  curvedLine: {
    height: "6%",
    width,
    backgroundColor: "#fff",
    borderTopLeftRadius: CURVE_HEIGHT / 2,
    borderTopRightRadius: CURVE_HEIGHT / 2,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    fontSize: 20,
    color: "red",
  },
  cameraButton: {
    position: "absolute",
    bottom: "0%",
    right: "0%",
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 10,
  },
  cameraIcon: {
    fontSize: 35,
  },
});

export default HomeScreen;
