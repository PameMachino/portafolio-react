import { useEffect, useMemo, useRef, useState } from 'react'
import './Tetris.css'

const ROWS = 20
const COLS = 10
const EMPTY = 0

const SHAPES = [
  {
    name: 'I',
    color: '#38bdf8',
    rotations: [
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]],
    ],
  },
  {
    name: 'O',
    color: '#facc15',
    rotations: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  {
    name: 'T',
    color: '#a78bfa',
    rotations: [
      [
        [0, 1, 0],
        [1, 1, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 0],
      ],
      [
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
    ],
  },
  {
    name: 'L',
    color: '#fb923c',
    rotations: [
      [
        [1, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1],
        [0, 1],
        [0, 1],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
    ],
  },
  {
    name: 'J',
    color: '#60a5fa',
    rotations: [
      [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
      ],
      [
        [1, 1],
        [1, 0],
        [1, 0],
      ],
      [
        [1, 1, 1],
        [0, 0, 1],
      ],
    ],
  },
  {
    name: 'S',
    color: '#4ade80',
    rotations: [
      [
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    ],
  },
  {
    name: 'Z',
    color: '#f87171',
    rotations: [
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
    ],
  },
]

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY))
}

function randomPiece() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  return {
    shape,
    rotation: 0,
    row: 0,
    col: Math.floor(COLS / 2) - 1,
  }
}

function getMatrix(piece) {
  return piece.shape.rotations[piece.rotation]
}

function isValidMove(board, piece, newRow, newCol, newRotation = piece.rotation) {
  const matrix = piece.shape.rotations[newRotation]

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue

      const boardRow = newRow + r
      const boardCol = newCol + c

      if (boardCol < 0 || boardCol >= COLS || boardRow >= ROWS) {
        return false
      }

      if (boardRow >= 0 && board[boardRow][boardCol] !== EMPTY) {
        return false
      }
    }
  }

  return true
}

function mergePiece(board, piece) {
  const newBoard = board.map((row) => [...row])
  const matrix = getMatrix(piece)

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue

      const boardRow = piece.row + r
      const boardCol = piece.col + c

      if (boardRow >= 0) {
        newBoard[boardRow][boardCol] = piece.shape.color
      }
    }
  }

  return newBoard
}

function clearLines(board) {
  const filtered = board.filter((row) => row.some((cell) => cell === EMPTY))
  const cleared = ROWS - filtered.length

  while (filtered.length < ROWS) {
    filtered.unshift(Array(COLS).fill(EMPTY))
  }

  return { board: filtered, cleared }
}

function getGhostRow(board, piece) {
  let ghostRow = piece.row
  while (isValidMove(board, piece, ghostRow + 1, piece.col)) {
    ghostRow++
  }
  return ghostRow
}

export default function Tetris() {
  const [board, setBoard] = useState(createBoard)
  const [piece, setPiece] = useState(randomPiece)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(500)

  const intervalRef = useRef(null)

  const nextBoard = useMemo(() => {
    const tempBoard = board.map((row) => [...row])
    const ghostRow = getGhostRow(board, piece)
    const matrix = getMatrix(piece)

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (!matrix[r][c]) continue

        const gr = ghostRow + r
        const gc = piece.col + c

        if (gr >= 0 && tempBoard[gr][gc] === EMPTY) {
          tempBoard[gr][gc] = 'ghost'
        }
      }
    }

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (!matrix[r][c]) continue

        const pr = piece.row + r
        const pc = piece.col + c

        if (pr >= 0) {
          tempBoard[pr][pc] = piece.shape.color
        }
      }
    }

    return tempBoard
  }, [board, piece])

  function spawnNewPiece(currentBoard) {
    const newPiece = randomPiece()
    if (!isValidMove(currentBoard, newPiece, newPiece.row, newPiece.col)) {
      setGameOver(true)
      setIsPlaying(false)
      return
    }
    setPiece(newPiece)
  }

  function lockPiece() {
    const merged = mergePiece(board, piece)
    const { board: clearedBoard, cleared } = clearLines(merged)

    setBoard(clearedBoard)

    if (cleared > 0) {
      setLines((prev) => prev + cleared)
      setScore((prev) => prev + cleared * 100)
      setSpeed((prev) => Math.max(120, prev - cleared * 15))
    }

    spawnNewPiece(clearedBoard)
  }

  function moveDown() {
    if (gameOver || !isPlaying) return

    if (isValidMove(board, piece, piece.row + 1, piece.col)) {
      setPiece((prev) => ({ ...prev, row: prev.row + 1 }))
    } else {
      lockPiece()
    }
  }

  function hardDrop() {
    if (gameOver || !isPlaying) return
    const ghostRow = getGhostRow(board, piece)
    const droppedPiece = { ...piece, row: ghostRow }
    const merged = mergePiece(board, droppedPiece)
    const { board: clearedBoard, cleared } = clearLines(merged)

    setBoard(clearedBoard)
    setScore((prev) => prev + 20 + cleared * 100)
    setLines((prev) => prev + cleared)

    if (cleared > 0) {
      setSpeed((prev) => Math.max(120, prev - cleared * 15))
    }

    spawnNewPiece(clearedBoard)
  }

  function rotatePiece() {
    if (gameOver || !isPlaying) return

    const nextRotation = (piece.rotation + 1) % piece.shape.rotations.length
    const kicks = [0, -1, 1, -2, 2]

    for (const kick of kicks) {
      if (isValidMove(board, piece, piece.row, piece.col + kick, nextRotation)) {
        setPiece((prev) => ({
          ...prev,
          rotation: nextRotation,
          col: prev.col + kick,
        }))
        return
      }
    }
  }

  function moveHorizontal(dir) {
    if (gameOver || !isPlaying) return

    if (isValidMove(board, piece, piece.row, piece.col + dir)) {
      setPiece((prev) => ({ ...prev, col: prev.col + dir }))
    }
  }

  function resetGame() {
    const freshBoard = createBoard()
    const freshPiece = randomPiece()

    setBoard(freshBoard)
    setPiece(freshPiece)
    setScore(0)
    setLines(0)
    setSpeed(500)
    setGameOver(false)
    setIsPlaying(true)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'a') moveHorizontal(-1)
      if (e.key === 'd') moveHorizontal(1)
      if (e.key === 's') moveDown()
      if (e.key === 'w') rotatePiece()
      if (e.key === ' ') {
        e.preventDefault()
        hardDrop()
      }
      if (e.key.toLowerCase() === 'p') {
        setIsPlaying((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [board, piece, gameOver, isPlaying])

  useEffect(() => {
    if (!isPlaying || gameOver) return

    intervalRef.current = setInterval(() => {
      moveDown()
    }, speed)

    return () => clearInterval(intervalRef.current)
  }, [board, piece, speed, isPlaying, gameOver])

  return (
  <section id="tetris" className="tetris-section">
      <div className="tetris-header">
        <div>
          <p className="tetris-eyebrow">Mini juego</p>
          <h2>Tetris en React</h2>
          <p className="tetris-description">
            Una demo interactiva integrada al portafolio para mostrar lógica,
            componentes y manejo de estado.
          </p>
        </div>

        <div className="tetris-stats">
          <div className="tetris-stat">
            <span>Puntaje</span>
            <strong>{score}</strong>
          </div>
          <div className="tetris-stat">
            <span>Líneas</span>
            <strong>{lines}</strong>
          </div>
          <div className="tetris-stat">
            <span>Estado</span>
            <strong>{gameOver ? 'Game Over' : isPlaying ? 'Jugando' : 'Pausa'}</strong>
          </div>
        </div>
      </div>

      <div className="tetris-wrapper">
        <div className="tetris-board">
          {nextBoard.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`tetris-cell ${cell === 'ghost' ? 'ghost' : ''}`}
                style={{
                  backgroundColor:
                    cell && cell !== 'ghost' ? cell : cell === 'ghost' ? 'transparent' : '#0f172a',
                  borderColor: cell === 'ghost' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(255,255,255,0.06)',
                }}
              />
            ))
          )}
        </div>

        <div className="tetris-panel">
          <div className="tetris-controls">
            <h3>Controles</h3>
            <ul>
              <li>(← a) (b →) mover</li>
              <li>↑ w rotar</li>
              <li>↓ s bajar</li>
              <li>Espacio: caída rápida</li>
              <li>P: pausa</li>
            </ul>
          </div>

          <div className="tetris-actions">
            <button onClick={resetGame}>Reiniciar</button>
            <button onClick={() => setIsPlaying((prev) => !prev)}>
              {isPlaying ? 'Pausar' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}