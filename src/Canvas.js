import {useEffect, useState} from "react";
import {BOARD_SIZE} from "./Gomoku";
const {useRef} = require("react");

const useMousePosition = (global) => {
    const [mouseCoords, setMouseCoords] = useState({x: 0, y: 0});

    const handleCursorMovement = (event) => {
        let rect = event.target.getBoundingClientRect();
        setMouseCoords({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
    };
    useEffect(() => {
        if (global) {
            window.addEventListener("mousemove", handleCursorMovement);
            return () => {
                window.removeEventListener("mousemove", handleCursorMovement);
            };
        }
    }, [global]);

    return [mouseCoords, handleCursorMovement];
};

const drawBoard = (context, canvas) => {
    context.beginPath();
    context.fillStyle = '#DEA350';
    context.fillRect(0, 0, canvas.height, canvas.height);
    const cellSize = canvas.height / BOARD_SIZE;
    const p = cellSize / 2;
    for (let x = 0; x <= canvas.height - cellSize; x += cellSize) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, canvas.height - p);
    }

    for (let x = 0; x <= canvas.height - cellSize; x += cellSize) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(canvas.height - p, 0.5 + x + p);
    }

    context.strokeStyle = "black";
    context.stroke();
};

const fillCircle = (x, y, ctx, chess, counter, canvas) => {
    ctx.beginPath();
    ctx.fillStyle = chess[x][y];
    const cellSize = canvas.height / BOARD_SIZE;
    const p = cellSize / 2;
    ctx.arc(y * cellSize + p, x * cellSize + p, p, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = chess[x][y] === 'white' ? 'black' : 'white';
    ctx.font = '20px Arial';
    if (canvas.height < 480) ctx.font = '12px Arial';
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillText(counter, y * cellSize + p, x * cellSize + p);
};

const Canvas = ({chess, chessPlaced, handleCellClick}) => {
    const canvasRef = useRef(null);
    const [coords, handleCoords] = useMousePosition(true);
    const [width, setWidth] = useState(window.innerWidth);
    let canvasWidth;

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        drawBoard(ctx, canvas);
    }, []);



    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard(ctx, canvas);
        for (let i = 0; i < chessPlaced.length; i++) {
            fillCircle(chessPlaced[i][0], chessPlaced[i][1], ctx, chess, i + 1, canvas);
        }
    }, [chessPlaced]);

    const handleClick = (e) => {
        handleCoords(e);
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const cellSize = canvas.height / BOARD_SIZE;
            const rowIndex = Math.floor(coords.y / cellSize);
            const columnIndex = Math.floor(coords.x / cellSize);
            handleCellClick(rowIndex, columnIndex);
        }
    };

    if (width > 1200) canvasWidth = 750;
    else if (width > 640) canvasWidth = 600;
    else if (width > 480) canvasWidth = 450;
    else if (width > 350) canvasWidth = 300;
    else canvasWidth = 225;


    return <canvas ref={canvasRef} onClick={handleClick} id='canvas' height={canvasWidth} width={canvasWidth}/>
}

export default Canvas;
