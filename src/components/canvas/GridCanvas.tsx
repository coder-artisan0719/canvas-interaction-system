import React, { useEffect, useRef } from 'react';
import { CELL_SIZE, GRID_ROWS, GRID_COLS } from '../../constants';

const GridCanvas = ({ style }: { style?: React.CSSProperties }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = GRID_COLS * CELL_SIZE;
    const height = GRID_ROWS * CELL_SIZE;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_COLS; i++) {
      const x = i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let i = 0; i <= GRID_ROWS; i++) {
      const y = i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        ...style,
      }}
    />
  );
};

export default GridCanvas;
