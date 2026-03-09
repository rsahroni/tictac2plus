import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Pawn } from './Pawn';

export const Board = ({ board, selectedPawn, onCellPress, playerColors }) => {
  return (
    <View style={[styles.board, { backgroundColor: Colors.board }]}>
      {board.map((cell, index) => {
        const isSelected = selectedPawn === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.cell, { backgroundColor: Colors.cell }]}
            onPress={() => onCellPress(index)}
            activeOpacity={0.8}
          >
            {cell && (
              <Pawn 
                player={cell} 
                isSelected={isSelected} 
                playerColors={playerColors}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 320,
    height: 320,
    padding: 10,
    borderRadius: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  cell: {
    width: '30%',
    height: '30%',
    margin: '1.66%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});
