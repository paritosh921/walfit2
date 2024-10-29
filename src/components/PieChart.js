// import React from "react";
// import { View, Button, ScrollView } from "react-native";
// import { PieChart } from "react-native-chart-kit";
// import { Dimensions } from "react-native";

// const screenWidth = Dimensions.get("window").width;

// const ChartComponent = () => {
//   const [data, setData] = React.useState([
//     {
//       name: "Red",
//       population: 20,
//       color: "red",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     },
//     {
//       name: "Orange",
//       population: 15,
//       color: "orange",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     },
//     {
//       name: "Yellow",
//       population: 25,
//       color: "yellow",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     },
//     {
//       name: "Green",
//       population: 30,
//       color: "green",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     },
//     {
//       name: "Blue",
//       population: 10,
//       color: "blue",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     },
//   ]);

//   const randomizeData = () => {
//     setData(
//       data.map((item) => ({
//         ...item,
//         population: Math.floor(Math.random() * 100),
//       }))
//     );
//   };

//   const addDataset = () => {
//     const newDataset = {
//       name: `New Data ${data.length + 1}`,
//       population: Math.floor(Math.random() * 100),
//       color: "grey",
//       legendFontColor: "#7F7F7F",
//       legendFontSize: 15,
//     };
//     setData([...data, newDataset]);
//   };

//   const removeDataset = () => {
//     setData(data.slice(0, -1));
//   };

//   return (
//     <ScrollView>
//       <View>
//         <PieChart
//           data={data}
//           width={screenWidth}
//           height={220}
//           chartConfig={{
//             backgroundColor: "#1cc910",
//             backgroundGradientFrom: "#eff3ff",
//             backgroundGradientTo: "#efefef",
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: {
//               borderRadius: 16,
//             },
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute // for doughnut chart
//         />
//       </View>
//       <View>
//         <Button title="Randomize Data" onPress={randomizeData} />
//         <Button title="Add Dataset" onPress={addDataset} />
//         <Button title="Remove Dataset" onPress={removeDataset} />
//       </View>
//     </ScrollView>
//   );
// };

// export default ChartComponent;
import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

const TestChart = ({
    totalCalories,
    totalFat,
    totalProtein,
}) => {
    console.log(totalCalories, totalFat, totalProtein);
  const widthAndHeight = 200;
  const series = [totalCalories, totalFat, totalProtein];
    const sliceColor = ["#F44336", "#2196F3", "#FFEB3B"];

  return (
    // <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Basic</Text>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.45}
          coverFill={"#FFF"}
        />
        <Text style={styles.title}>
            Total Calories: {totalCalories} Total Fat: {totalFat} Total Protein: {totalProtein}
        </Text>
      </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 400,
  },
  title: {
    // fontSize: 24,
    // margin: 10,
  },
});

export default TestChart;
