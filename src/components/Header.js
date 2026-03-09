import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { SlotIndicator } from './SlotIndicator';

export const Header = ({ currentPlayer, phase, placedPawns, playerColors }) => {
  const p1ColorKey = playerColors.player1;
  const p2ColorKey = playerColors.player2;

  return (
    <View style={styles.header}>
      {/* Phase Text moved higher */}
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseText}>{phase === 'DROP' ? 'PLACE' : 'SLIDE'}</Text>
      </View>

      <View style={styles.playersContainer}>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerLabel, { color: Colors[p1ColorKey] }]}>PLAYER 1</Text>
          <SlotIndicator player="player1" placedCount={placedPawns.player1} playerColors={playerColors} />
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={[styles.playerLabel, { color: Colors[p2ColorKey], textAlign: 'right' }]}>PLAYER 2</Text>
          <SlotIndicator player="player2" placedCount={placedPawns.player2} playerColors={playerColors} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '85%',
    marginBottom: 40,
    alignItems: 'center',
  },
  phaseContainer: {
    marginBottom: 20,
  },
  phaseText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 30, // Brought closer to center
  },
  playerInfo: {
    alignItems: 'center',
  },
  playerLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  vsContainer: {
    paddingHorizontal: 10,
  },
  vsText: {
    color: '#3D3D4D',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
