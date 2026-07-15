'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type UseRovingGridFocusOptions = {
  rows: number;
  cols: number;
  defaultRow?: number;
  defaultCol?: number;
  onActivate?: (row: number, col: number) => void;
  onPageUp?: () => boolean;
  onPageDown?: () => boolean;
};

export type UseRovingGridFocusResult = {
  containerRef: React.RefObject<HTMLDivElement>;
  focusRow: number;
  focusCol: number;
  focusCell: (row: number, col: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  getTabIndex: (row: number, col: number) => number;
};

export function useRovingGridFocus({
  rows,
  cols,
  defaultRow = 0,
  defaultCol = 0,
  onActivate,
  onPageUp,
  onPageDown,
}: UseRovingGridFocusOptions): UseRovingGridFocusResult {
  const [focusRow, setFocusRow] = useState(Math.min(defaultRow, rows - 1));
  const [focusCol, setFocusCol] = useState(Math.min(defaultCol, cols - 1));
  const containerRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement | null>;

  const focusRowRef = useRef(focusRow);
  const focusColRef = useRef(focusCol);
  focusRowRef.current = focusRow;
  focusColRef.current = focusCol;

  const focusCell = useCallback((row: number, col: number) => {
    if (!containerRef.current) return;
    const cell = containerRef.current.querySelector(
      `[data-roving-row="${row}"][data-roving-col="${col}"]`,
    ) as HTMLElement | null;
    if (cell) {
      cell.focus();
      setFocusRow(row);
      setFocusCol(col);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const key = e.key;
    const curRow = focusRowRef.current;
    const curCol = focusColRef.current;
    let newRow = curRow;
    let newCol = curCol;

    switch (key) {
      case 'ArrowLeft':
        if (curCol <= 0) return;
        newCol = curCol - 1;
        break;
      case 'ArrowRight':
        if (curCol >= cols - 1) return;
        newCol = curCol + 1;
        break;
      case 'ArrowUp':
        if (curRow <= 0) return;
        newRow = curRow - 1;
        break;
      case 'ArrowDown':
        if (curRow >= rows - 1) return;
        newRow = curRow + 1;
        break;
      case 'Home':
        newCol = 0;
        break;
      case 'End':
        newCol = cols - 1;
        break;
      case 'PageUp':
        if (onPageUp ? !onPageUp() : true) return;
        return;
      case 'PageDown':
        if (onPageDown ? !onPageDown() : true) return;
        return;
      case 'Enter':
      case ' ':
        if (!containerRef.current) return;
        {
          const cell = containerRef.current.querySelector(
            `[data-roving-row="${curRow}"][data-roving-col="${curCol}"]`,
          );
          if (e.target === cell) {
            e.preventDefault();
            onActivate?.(curRow, curCol);
          }
        }
        return;
      default:
        return;
    }

    if (newRow !== curRow || newCol !== curCol) {
      e.preventDefault();
      focusCell(newRow, newCol);
    }
  }, [cols, rows, onActivate, onPageUp, onPageDown, focusCell]);

  useEffect(() => {
    setFocusRow((prev) => Math.min(prev, rows - 1));
    setFocusCol((prev) => Math.min(prev, cols - 1));
  }, [rows, cols]);

  const getTabIndex = useCallback(
    (row: number, col: number): number =>
      row === focusRow && col === focusCol ? 0 : -1,
    [focusRow, focusCol],
  );

  return { containerRef: containerRef as unknown as React.RefObject<HTMLDivElement>, focusRow, focusCol, focusCell, handleKeyDown, getTabIndex };
}
