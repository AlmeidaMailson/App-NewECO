import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 412;
const BASE_HEIGHT = 915;

export const scaleWidth = (size) => (width / BASE_WIDTH) * size;

export const scaleHeight = (size) => (height / BASE_HEIGHT) * size;

export const moderateScale = (size, factor = 0.5) => {
  return size + (scaleWidth(size) - size) * factor;
};

export const scaleFont = (size) => {
  const newSize = scaleWidth(size);
  return Math.round(PixelRatio.getFontScale() * newSize);
};