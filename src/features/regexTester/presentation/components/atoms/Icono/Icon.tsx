import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IconProps } from './types/types';
import { MaterialIcons } from '@expo/vector-icons';

const Icon = ({ name, size = 24, color = 'black', style }: IconProps) => {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
};

export default Icon;