import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Canvas, Path, Skia, Text } from "@shopify/react-native-skia";
import DonutPath from "./DonutPath";

const DonutChart = ({
  n,
  gap,
  decimals,
  colors,
  totalValue,
  strokeWidth,
  outerStrokeWidth,
  radius,
  font,
  smallFont,
}) => {
  // console.log("here in dougnut chart",decimals)
  const array = Array.from({ length: n });
  const innerRadius = radius - outerStrokeWidth / 2;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(
    () => `$${Math.round(totalValue.value)}`,
    []
  );

  const fontSize = font.measureText("$00");
  const smallFontSize = smallFont.measureText("Total Spent");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 2;
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color="#f4f7fc"
          style="stroke"
          strokeJoin="round"
          strokeWidth={outerStrokeWidth}
          strokeCap="round"
          start={0}
          end={1}
        />
        {array.map((_, index) => {
          return (
            <DonutPath
              key={index}
              radius={radius}
              strokeWidth={strokeWidth}
              outerStrokeWidth={outerStrokeWidth}
              color={colors[index]}
              decimals={decimals}
              index={index}
              gap={gap}
            />
          );
        })}
        {/* <Text
          x={radius - smallFontSize.width / 2}
          y={radius + smallFontSize.height / 2 - fontSize.height / 1.0}
          text={`Calories ${(decimals.value[0] * 100).toFixed(0)}%`}
          font={smallFont}
          color="black"
        />
        <Text
          x={radius - smallFontSize.width / 2}
          y={radius + smallFontSize.height / 0.6 - fontSize.height / 1.0}
          text={`Fats ${(decimals.value[1] * 100).toFixed(0)}%`}
          font={smallFont}
          color="black"
        />
        <Text
          x={radius - smallFontSize.width / 2}
          y={radius + smallFontSize.height / 0.35 - fontSize.height / 1.0}
          text={`Protein ${(decimals.value[2] * 100).toFixed(0)}%`}
          font={smallFont}
          color="black"
        /> */}
      </Canvas>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
