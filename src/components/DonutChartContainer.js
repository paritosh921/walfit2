import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DonutChart from "../components/DonutChart";
import { useFont } from "@shopify/react-native-skia";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderItem from "./RenderItem";
import { useAppState } from "../utils/contextAPI";
import { useSharedValue } from "react-native-reanimated";

const RADIUS = 100;
const STROKE_WIDTH = 15;
const OUTER_STROKE_WIDTH = 30;
const GAP = 0.04;

export const DonutChartContainer = () => {
  function calculateNutritionSummary(data) {
    const totalValues = data.reduce(
      (acc, item) => {
        acc.calories += parseFloat(item.calories);
        acc.fat += parseFloat(item.fat);
        acc.protein += parseFloat(item.protein);
        return acc;
      },
      { calories: 0, fat: 0, protein: 0 }
    );

    const totalSum =
      totalValues.calories + totalValues.fat + totalValues.protein;

    const nutritionSummary = [
      {
        name: "Calories",
        value: totalValues.calories,
        color: "#fe769c",
        percentage: ((totalValues.calories / totalSum) * 100).toFixed(2),
      },
      {
        name: "Fat",
        value: totalValues.fat,
        color: "#46a0f8",
        percentage: ((totalValues.fat / totalSum) * 100).toFixed(2),
      },
      {
        name: "Protein",
        value: totalValues.protein,
        color: "#c3f439",
        percentage: ((totalValues.protein / totalSum) * 100).toFixed(2),
      },
    ];

    return nutritionSummary;
  }

  const n = 3;
  const { data } = useAppState();
  const [modifiedData, setModifiedData] = useState();
  const totalValue = useSharedValue(0);
  const [decimals, setDecimals] = useState({ value: [0.8, 0.1, 0.1] });
  const colors = ["#fe769c", "#46a0f8", "#c3f439"];
  totalValue.value = 4520;

  useEffect(() => {
    if (data) {
      const calculatedData = calculateNutritionSummary(data);
      setModifiedData(calculatedData);
      const decimalValues = calculateDecimalValues(calculatedData);
      setDecimals({ value: decimalValues });
    }
  }, [data]);

  function calculateDecimalValues(data) {
    return data?.map((item) =>
      parseFloat((parseFloat(item.percentage) / 100).toFixed(2))
    );
  }

  const font = useFont(require("../assets/fonts/Roboto-Light.ttf"), 22);
  const smallFont = useFont(require("../assets/fonts/Roboto-Bold.ttf"), 15);

  if (!font || !smallFont) {
    return <View />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chartAndLegendContainer}>
        <View style={styles.chartContainer}>
          <DonutChart
            radius={RADIUS}
            gap={GAP}
            strokeWidth={STROKE_WIDTH}
            outerStrokeWidth={OUTER_STROKE_WIDTH}
            font={font}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
          />
        </View>
        <View style={styles.legendContainer}>
          {modifiedData?.map((item, index) => {
            return <RenderItem item={item} key={index} index={index} />;
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  chartAndLegendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  chartContainer: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    marginTop: 10,
  },
  legendContainer: {
    flex: 1,
    marginLeft: 10,
  },
});

export default DonutChartContainer;
