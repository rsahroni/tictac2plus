import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Audio } from 'expo-av';

export const HomeScreen = ({ onStart }) => {
  const [player1Color, setPlayer1Color] = useState('red');
  const [player2Color, setPlayer2Color] = useState('blue');
  const [mode, setMode] = useState('PVP');
  const [sound, setSound] = useState(null);

  const options = ['red', 'blue', 'green', 'yellow'];

  useEffect(() => {
    async function playBackgroundMusic() {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../assets/audio/tt2p-gameplay.mp3'),
          { shouldPlay: true, isLooping: true, volume: 0.5 }
        );
        setSound(newSound);
      } catch (error) {
        console.log('Error playing music:', error);
      }
    }

    playBackgroundMusic();

    // Cleanup: stop and unload sound when leaving home screen
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, []);

  // Additional cleanup to ensure sound is stopped if setSound was slow
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TicTac2Plus</Text>
      <Text style={styles.subtitle}>SETUP YOUR BATTLE</Text>

      <View style={styles.setupSection}>
        <Text style={styles.playerLabel}>GAME MODE</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'PVP' && styles.selectedMode]} 
            onPress={() => setMode('PVP')}
          >
            <Text style={[styles.modeText, mode === 'PVP' && styles.selectedModeText]}>2 PLAYERS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'PVE' && styles.selectedMode]} 
            onPress={() => setMode('PVE')}
          >
            <Text style={[styles.modeText, mode === 'PVE' && styles.selectedModeText]}>VS BOT</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.playerLabel, { marginTop: 30 }]}>PLAYER 1 COLOR</Text>
        <View style={styles.colorRow}>
          {options.map((c) => {
            const isTakenByOther = player2Color === c;
            const isSelected = player1Color === c;
            return (
              <TouchableOpacity
                key={c}
                disabled={isTakenByOther}
                style={[
                  styles.colorOption,
                  { backgroundColor: Colors[c] },
                  isSelected && styles.selectedColor,
                  isTakenByOther && styles.disabledColor
                ]}
                onPress={() => setPlayer1Color(c)}
              />
            );
          })}
        </View>

        <Text style={[styles.playerLabel, { marginTop: 30 }]}>
          {mode === 'PVP' ? 'PLAYER 2 COLOR' : 'BOT COLOR'}
        </Text>
        <View style={styles.colorRow}>
          {options.map((c) => {
            const isTakenByOther = player1Color === c;
            const isSelected = player2Color === c;
            return (
              <TouchableOpacity
                key={c}
                disabled={isTakenByOther}
                style={[
                  styles.colorOption,
                  { backgroundColor: Colors[c] },
                  isSelected && styles.selectedColor,
                  isTakenByOther && styles.disabledColor
                ]}
                onPress={() => setPlayer2Color(c)}
              />
            );
          })}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => onStart(player1Color, player2Color, mode)}
      >
        <Text style={styles.startText}>START BATTLE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E26',
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666677',
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 50,
  },
  setupSection: {
    width: '85%',
    marginBottom: 50,
  },
  playerLabel: {
    color: '#A0A0B0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  selectedMode: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  modeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  selectedModeText: {
    color: '#1E1E26',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  disabledColor: {
    opacity: 0.15,
    transform: [{ scale: 0.8 }],
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  startText: {
    color: '#1E1E26',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
