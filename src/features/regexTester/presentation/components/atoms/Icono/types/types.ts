import { StyleProp, TextStyle } from 'react-native';

export interface IconProps {
  name: string; 
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}