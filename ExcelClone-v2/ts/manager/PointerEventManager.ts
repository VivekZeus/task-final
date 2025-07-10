export interface PointerEventManager {
  test(
    x: number,
    y: number,
    e: PointerEvent,
    startRow?: number,
    endRow?: number,
    startCol?: number,
    endCol?: number,
    scrollLeft?: number,
    scrollTop?: number
  ): boolean;

  onPointerDown(
    x: number,
    y: number,
    e: PointerEvent,
    startRow?: number,
    endRow?: number,
    startCol?: number,
    endCol?: number,
    scrollLeft?: number,
    scrollTop?: number
  ): void;

  onPointerMove(
    x: number,
    y: number,
    e: PointerEvent,
    startRow?: number,
    endRow?: number,
    startCol?: number,
    endCol?: number,
    scrollLeft?: number,
    scrollTop?: number
  ): void;
  
  onPointerUp(
    x: number,
    y: number,
    e: PointerEvent,
    startRow?: number,
    endRow?: number,
    startCol?: number,
    endCol?: number,
    scrollLeft?: number,
    scrollTop?: number
  ): void;
}
