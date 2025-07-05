import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { CardProps } from './types/types';

const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  card: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 15,
      shadowColor: '#808080',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
      width: '100%',
      maxWidth: 480,
      marginBottom: 20,
    },
});