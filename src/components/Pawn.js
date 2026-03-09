import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';

export const Pawn = ({ player, isSelected, playerColors }) => {
  const colorKey = playerColors[player];
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animasi mulus saat dipilih atau batal dipilih
    Animated.spring(scale, {
      toValue: isSelected ? 1.2 : 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View 
      style={[
        styles.pawn, 
        { 
          backgroundColor: Colors[colorKey],
          transform: [{ scale: scale }]
        }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  pawn: {
    width: '75%',
    height: '75%',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
});
