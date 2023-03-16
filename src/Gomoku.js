import './gomoku.css';
import {useEffect, useState} from "react";
import Canvas from "./Canvas";

const GAME_STATE = {
    BLACK_TURN: '黑棋回合',
    WHITE_TURN: '白棋回合',
    BLACK_WIN: '黑棋胜利！',
    WHITE_WIN: '白棋胜利！',
    DRAW: '平局',
};

export const BOARD_SIZE = 15;
const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

const Gomoku = () => {
    const board = Array(BOARD_SIZE - 1).fill('');
    const [chess, setChess] = useState(Array(BOARD_SIZE).fill('').map(_ => Array(BOARD_SIZE).fill('empty')));
    const [counters, setCounters] = useState(Array(BOARD_SIZE).fill('').map(_ => Array(BOARD_SIZE).fill(0)));
    const [gameState, setGameState] = useState(GAME_STATE.BLACK_TURN);
    const [chessPlaced, setChessPlaced] = useState([]);
    const [isCanvas, setIsCanvas] = useState(false);

    useEffect(() => {
        if (chessPlaced.length === 0) return;
        const lastPlaced = chessPlaced[chessPlaced.length - 1];
        const color = chess[lastPlaced[0]][lastPlaced[1]];
        if (checkWin(color)) {
            if (color === 'black') {
                setGameState(GAME_STATE.BLACK_WIN);
            } else {
                setGameState(GAME_STATE.WHITE_WIN);
            }
        } else if (chessPlaced.length === BOARD_SIZE * BOARD_SIZE) {
            setGameState(GAME_STATE.DRAW);
        } else {
            setGameState(color === 'black' ? GAME_STATE.WHITE_TURN : GAME_STATE.BLACK_TURN);
        }
    }, [chessPlaced]);

    const handleCellClick = (rowIndex, columnIndex) => {
        if (chess[rowIndex][columnIndex] !== 'empty') return;
        if (gameState !== GAME_STATE.BLACK_TURN && gameState !== GAME_STATE.WHITE_TURN) return;
        chess[rowIndex][columnIndex] = gameState === GAME_STATE.BLACK_TURN ? 'black' : 'white';
        counters[rowIndex][columnIndex] = chessPlaced.length + 1;
        setCounters([...counters]);
        setChess([...chess]);
        let temp = [...chessPlaced];
        temp.push([rowIndex, columnIndex]);
        setChessPlaced(temp);
    };

    const checkWin = (color) => {
        const counts = Array(8).fill(0);
        for (let i = 0; i < directions.length; i++) {
            const direction = directions[i];
            let currentPosition = [...chessPlaced[chessPlaced.length - 1]];
            while (true) {
                currentPosition[0] += direction[0];
                currentPosition[1] += direction[1];
                if (currentPosition[0] < 0 || currentPosition[0] >= BOARD_SIZE || currentPosition[1] < 0 ||
                    currentPosition[1] >= BOARD_SIZE || chess[currentPosition[0]][currentPosition[1]] === 'empty' ||
                    chess[currentPosition[0]][currentPosition[1]] !== color) break;
                ++counts[i];
            }
        }
        for (let i = 0; i < directions.length / 2; i++) {
            if (counts[i] + counts[i + directions.length / 2] >= 4) return true;
        }
        return false;
    };

    const regret = () => {
        if (chessPlaced.length < 2) return;
        for (let i = 0; i < 2; i++) {
            const lastPlaced = chessPlaced.pop();
            chess[lastPlaced[0]][lastPlaced[1]] = 'empty';
            counters[lastPlaced[0]][lastPlaced[1]] = 0;
        }
        setChess([...chess]);
        setChessPlaced([...chessPlaced]);
        setCounters([...counters]);
    };

    const reset = () => {
        setChess(Array(BOARD_SIZE).fill('').map(_ => Array(BOARD_SIZE).fill('empty')));
        setGameState(GAME_STATE.BLACK_TURN);
        setChessPlaced([]);
        setCounters(Array(BOARD_SIZE).fill('').map(_ => Array(BOARD_SIZE).fill(0)));
    };

    return (
        <div className='body'>
            <div className='mode'>
                <button className='btn btn-info text' onClick={() => {
                    // reset();
                    setIsCanvas(!isCanvas);
                }}>切换至{isCanvas ? 'DOM' : 'Canvas'}模式
                </button>
            </div>
            <div className='text game-status'>当前状态：{gameState}</div>
            {isCanvas ?
                <Canvas setChess={setChess} chess={chess} chessPlaced={chessPlaced} setChessPlaced={setChessPlaced}
                        gameState={gameState} counters={counters} setCounters={setCounters}
                        handleCellClick={handleCellClick}/> :
                <div className='board-wrapper'>
                    <div className='board'>
                        {board.map((_, index) => (
                            <div className='row' key={index}>
                                {board.map((_, index) => (
                                    <div className='cell' key={index}/>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className='chess-container'>
                        {chess.map((row, rowIndex) => (
                            <div className='row' key={rowIndex}>
                                {row.map((cell, columnIndex) => (
                                    <div
                                        className={
                                            `cell ${cell} ${chessPlaced.length > 0 &&
                                            chessPlaced[chessPlaced.length - 1][0] === rowIndex &&
                                            chessPlaced[chessPlaced.length - 1][1] === columnIndex ?
                                                'last' : ''}`
                                        }
                                        key={columnIndex}
                                        onClick={() => handleCellClick(rowIndex, columnIndex)}>
                                    <span className='counter text'>
                                        {counters[rowIndex][columnIndex] || ''}
                                    </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
            <div className='game-control'>
                <button className='btn btn-primary text'
                        onClick={reset}
                >
                    重新开始
                </button>
                <button className='btn btn-secondary text' onClick={regret} disabled={chessPlaced.length < 2}>悔棋
                </button>
            </div>
        </div>
    );
}

export default Gomoku;
