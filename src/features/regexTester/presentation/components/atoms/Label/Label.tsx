// components/atoms/Label/Label.tsx
import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { LabelProps } from './types/types';

const Label = ({ text, style }: LabelProps) => {
  return <Text style={[styles.label, style]}>{text}</Text>;
};

export default Label;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});