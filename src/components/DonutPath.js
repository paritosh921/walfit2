import React, { useCallback } from "react";
import { Path, Skia } from "@shopify/react-native-skia";
import { useDerivedValue, withTiming } from "react-native-reanimated";
import ReRenderTrigger from "./ReRenderTrigger";

const DonutPath = ({
  radius,
  gap,
  strokeWidth,
  outerStrokeWidth,
  color,
  decimals,
  index,
}) => {
  // console.log("here in path", decimals.value, "index", index);

  const innerRadius = radius - outerStrokeWidth / 2;

  // Ensure the path is recreated on updates
  const path = useCallback(() => {
    const newPath = Skia.Path.Make();
    newPath.addCircle(radius, radius, innerRadius);
    return newPath;
  }, [radius, innerRadius, decimals.value]);

  const start = useDerivedValue(() => {
    if (index === 0) {
      return gap;
    }
    const decimal = decimals.value.slice(0, index);
    const sum = decimal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return withTiming(sum + gap, { duration: 1000 });
  }, [decimals.value, index]);

  const end = useDerivedValue(() => {
    if (index === decimals.value.length - 1) {
      return withTiming(1, { duration: 1000 });
    }
    const decimal = decimals.value.slice(0, index + 1);
    const sum = decimal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return withTiming(sum, { duration: 1000 });
  }, [decimals.value, index]);

  return (
    <>
      <Path
        path={path()}
        color={color}
        style="stroke"
        strokeJoin="round"
        strokeWidth={strokeWidth}
        strokeCap="round"
        start={start.value}
        end={end.value}
      />
      <ReRenderTrigger trigger={decimals.value} />
    </>
  );
};

export default DonutPath;
