import { StyleProp, ViewStyle } from "react-native";

export type IconButtonProps = {
  iconName: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
};