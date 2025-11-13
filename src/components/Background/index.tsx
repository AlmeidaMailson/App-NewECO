import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

type Props = {
  children: React.ReactNode;
};
  
export default function Background({ children }: Props) {
  return (
    <>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="40%"
            rx="70%"
            ry="70%"
            fx="50%"
            fy="40%"
          >
            <Stop offset="0%" stopColor="#00B89A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#005244" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
