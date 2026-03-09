import { useState, useEffect } from 'react';

export const useGameLogic = (initialStarter = 'player1', gameMode = 'PVP') => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(initialStarter);
  const [phase, setPhase] = useState('DROP');
  const [selectedPawn, setSelectedPawn] = useState(null);
  const [placedPawns, setPlacedPawns] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState(null);

  const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const ADJACENCY = {
    0: [1, 3, 4], 1: [0, 2, 3, 4, 5], 2: [1, 4, 5],
    3: [0, 1, 4, 6, 7], 4: [0, 1, 2, 3, 5, 6, 7, 8], 5: [1, 2, 4, 7, 8],
    6: [3, 4, 7], 7: [3, 4, 5, 6, 8], 8: [4, 5, 7],
  };

  const checkWinner = (currentBoard) => {
    for (let combo of WIN_COMBINATIONS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  // BOT LOGIC
  useEffect(() => {
    if (gameMode === 'PVE' && currentPlayer === 'player2' && !winner) {
      const timer = setTimeout(() => {
        makeBotMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, phase, winner]);

  const makeBotMove = () => {
    if (phase === 'DROP') {
      const emptyCells = board.map((cell, i) => cell === null ? i : null).filter(val => val !== null);
      if (emptyCells.length > 0) {
        const move = findBestDrop(emptyCells);
        executeDrop(move);
      }
    } else {
      // MOVE Phase Bot
      const move = findBestMove();
      if (move) {
        executeMove(move.from, move.to);
      }
    }
  };

  const findBestDrop = (emptyCells) => {
    // 1. Try to win
    for (let cell of emptyCells) {
      const tempBoard = [...board];
      tempBoard[cell] = 'player2';
      if (checkWinner(tempBoard) === 'player2') return cell;
    }
    // 2. Block player1
    for (let cell of emptyCells) {
      const tempBoard = [...board];
      tempBoard[cell] = 'player1';
      if (checkWinner(tempBoard) === 'player1') return cell;
    }
    // 3. Random
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const findBestMove = () => {
    const botPawns = board.map((cell, i) => cell === 'player2' ? i : null).filter(val => val !== null);
    const possibleMoves = [];

    botPawns.forEach(pawnIdx => {
      ADJACENCY[pawnIdx].forEach(neighbor => {
        if (board[neighbor] === null) {
          const tempBoard = [...board];
          tempBoard[pawnIdx] = null;
          tempBoard[neighbor] = 'player2';
          
          const isWinning = checkWinner(tempBoard) === 'player2';
          possibleMoves.push({ from: pawnIdx, to: neighbor, priority: isWinning ? 2 : 1 });
        }
      });
    });

    if (possibleMoves.length === 0) return null;

    // Prioritize winning moves
    const winningMoves = possibleMoves.filter(m => m.priority === 2);
    if (winningMoves.length > 0) return winningMoves[0];

    // Otherwise random move
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  };

  const executeDrop = (index) => {
    const newBoard = [...board];
    newBoard[index] = 'player2';
    setBoard(newBoard);

    const newPlaced = { ...placedPawns, player2: placedPawns.player2 + 1 };
    setPlacedPawns(newPlaced);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }

    if (newPlaced.player1 === 3 && newPlaced.player2 === 3) {
      setPhase('MOVE');
    }

    setCurrentPlayer('player1');
  };

  const executeMove = (from, to) => {
    const newBoard = [...board];
    newBoard[from] = null;
    newBoard[to] = 'player2';
    setBoard(newBoard);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }

    setCurrentPlayer('player1');
  };

  const handlePress = (index) => {
    if (winner) return;
    if (gameMode === 'PVE' && currentPlayer === 'player2') return;

    if (phase === 'DROP') {
      handleDropPhase(index);
    } else {
      handleMovePhase(index);
    }
  };

  const handleDropPhase = (index) => {
    if (board[index] || placedPawns[currentPlayer] >= 3) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newPlaced = { ...placedPawns, [currentPlayer]: placedPawns[currentPlayer] + 1 };
    setPlacedPawns(newPlaced);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }

    if (newPlaced.player1 === 3 && newPlaced.player2 === 3) {
      setPhase('MOVE');
    }

    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  const handleMovePhase = (index) => {
    const cellValue = board[index];

    if (cellValue === currentPlayer) {
      setSelectedPawn(index);
      return;
    }

    if (selectedPawn !== null && !cellValue) {
      const isNeighbor = ADJACENCY[selectedPawn].includes(index);
      
      if (isNeighbor) {
        const newBoard = [...board];
        newBoard[selectedPawn] = null;
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        
        const win = checkWinner(newBoard);
        if (win) {
          setWinner(win);
          setSelectedPawn(null);
          return;
        }

        setSelectedPawn(null);
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
      }
    }
  };

  const resetGame = (nextStarter) => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(nextStarter || initialStarter);
    setPhase('DROP');
    setSelectedPawn(null);
    setPlacedPawns({ player1: 0, player2: 0 });
    setWinner(null);
  };

  return {
    board,
    currentPlayer,
    phase,
    selectedPawn,
    placedPawns,
    winner,
    handlePress,
    resetGame
  };
};
