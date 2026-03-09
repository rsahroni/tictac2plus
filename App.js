import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  // State dasar game
  const [board, setBoard] = useState(Array(9).fill(null));
  // Default pemain: merah dan biru
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [phase, setPhase] = useState('DROP'); // Fase: DROP atau MOVE
  const [selectedPawn, setSelectedPawn] = useState(null);

  // Fungsi sementara untuk menangani klik pada kotak
  const handlePress = (index) => {
    console.log("Kotak yang diklik:", index);
    // Logika meletakkan dan menggeser pion akan kita bangun di sini nanti!

    // Contoh agar kamu bisa melihat visual pion saat diklik (sementara)
    if (!board[index]) {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'red' ? 'blue' : 'red');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TicTac2Plus</Text>
      <Text style={styles.subtitle}>Fase: {phase} | Giliran: {currentPlayer.toUpperCase()}</Text>

      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handlePress(index)}
          >
            {cell && (
              <View style={[styles.pawn, { backgroundColor: cell }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Latar sangat gelap agar warna pion menonjol
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaaaaa',
    marginBottom: 40,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Efek "neon glow" halus pada papan
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawn: {
    width: '70%',
    height: '70%',
    borderRadius: 50, // Membuatnya bulat sempurna
    // Efek glow pada pion
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
});