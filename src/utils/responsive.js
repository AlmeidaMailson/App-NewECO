import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 412;
const BASE_HEIGHT = 915;

export const scaleWidth = (size) => (width / BASE_WIDTH) * size;
export const scaleHeight = (size) => (height / BASE_HEIGHT) * size;
export const scaleFont = (size) => scaleWidth(size);