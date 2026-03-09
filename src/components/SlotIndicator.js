import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';

export const SlotIndicator = ({ player, placedCount, playerColors }) => {
  const slots = [1, 2, 3];
  const colorKey = playerColors[player];
  return (
    <View style={styles.slotRow}>
      {slots.map((s) => (
        <View 
          key={s} 
          style={[
            styles.slot, 
            { backgroundColor: s <= placedCount ? Colors[colorKey] : Colors.emptySlot }
          ]} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  slotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  slot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
