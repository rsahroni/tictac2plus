import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/constants/Colors';
import { useGameLogic } from './src/hooks/useGameLogic';
import { Header } from './src/components/Header';
import { Board } from './src/components/Board';
import { HomeScreen } from './src/components/HomeScreen';

export default function App() {
  const [screen, setScreen] = useState('HOME');
  const [gameMode, setGameMode] = useState('PVP');
  const [playerColors, setPlayerColors] = useState({ player1: 'red', player2: 'blue' });
  const [currentStarter, setCurrentStarter] = useState('player1');
  
  const exitProgress = useRef(new Animated.Value(0)).current;
  const winAnim = useRef(new Animated.Value(-200)).current; // For slide down effect

  const {
    board,
    currentPlayer,
    phase,
    selectedPawn,
    placedPawns,
    winner,
    handlePress,
    resetGame
  } = useGameLogic(currentStarter, gameMode);

  // Trigger win animation when winner is set
  useEffect(() => {
    if (winner) {
      Animated.spring(winAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      winAnim.setValue(-200);
    }
  }, [winner]);

  const handleStartGame = (p1Color, p2Color, mode) => {
    setPlayerColors({ player1: p1Color, player2: p2Color });
    setGameMode(mode);
    setScreen('GAME');
  };

  const handleReset = () => {
    const nextStarter = currentStarter === 'player1' ? 'player2' : 'player1';
    setCurrentStarter(nextStarter);
    resetGame(nextStarter);
  };

  const executeExit = () => {
    if (screen === 'GAME') {
      setScreen('HOME');
      setCurrentStarter('player1');
      resetGame('player1');
    } else {
      BackHandler.exitApp();
    }
    exitProgress.setValue(0);
  };

  const handlePressIn = () => {
    Animated.timing(exitProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        executeExit();
      }
    });
  };

  const handlePressOut = () => {
    Animated.timing(exitProgress).stop();
    Animated.spring(exitProgress, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  if (screen === 'HOME') {
    return (
      <>
        <StatusBar hidden />
        <HomeScreen onStart={handleStartGame} />
      </>
    );
  }

  const progressWidth = exitProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const turnColor = Colors[playerColors[currentPlayer]];

  return (
    <View style={[styles.outerContainer, { backgroundColor: turnColor }]}>
      <StatusBar hidden />
      
      <View style={[styles.innerContainer, { backgroundColor: Colors.background }]}>
        {/* Dynamic Area: Shows Header OR Winner Notification */}
        <View style={styles.topArea}>
          {!winner ? (
            <Header 
              currentPlayer={currentPlayer} 
              phase={phase} 
              placedPawns={placedPawns} 
              playerColors={playerColors}
            />
          ) : (
            <Animated.View 
              style={[
                styles.winnerBanner, 
                { transform: [{ translateY: winAnim }] }
              ]}
            >
              <Text style={[styles.winnerTitle, { color: Colors[playerColors[winner]] }]}>
                {winner === 'player2' && gameMode === 'PVE' ? 'BOT WINS!' : `${winner.toUpperCase()} WINS!`}
              </Text>
              <View style={styles.winnerButtons}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetText}>PLAY AGAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.winnerExitButton} onPress={executeExit}>
                  <Text style={styles.winnerExitText}>EXIT TO MENU</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>

        <Board 
          board={board} 
          selectedPawn={selectedPawn} 
          onCellPress={handlePress} 
          playerColors={playerColors}
        />

        <View style={styles.footer}>
          {gameMode === 'PVE' && currentPlayer === 'player2' && !winner && (
            <Text style={styles.botThinking}>BOT IS THINKING...</Text>
          )}
          <View style={styles.exitContainer}>
            <TouchableOpacity 
              style={styles.exitButton} 
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.progressOverlay, { width: progressWidth }]} />
              <Text style={styles.exitText}>HOLD TO EXIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 12,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topArea: {
    height: 180, // Fixed height to prevent board jumping
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerBanner: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  winnerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  winnerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetText: {
    color: '#1E1E26',
    fontWeight: '800',
    fontSize: 14,
  },
  winnerExitButton: {
    paddingVertical: 10,
  },
  winnerExitText: {
    color: '#A0A0B0',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  botThinking: {
    color: '#A0A0B0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 15,
  },
  exitContainer: {
    width: 160,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  exitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
  },
  exitText: {
    color: '#666677',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
