import { useCallback, useRef, useState } from 'react'
import { LONG_PRESS_DURATION, TOUCH_MOVE_THRESHOLD } from '@/lib/constants/timing'

interface UseLongPressOptions {
  onLongPress: () => void
  onClick?: () => void
  threshold?: number
  disabled?: boolean
}

interface UseLongPressReturn {
  isPressed: boolean
  isLongPressed: boolean
  reset: () => void
  handlers: {
    onMouseDown: () => void
    onMouseUp: () => void
    onMouseLeave: () => void
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onContextMenu: (e: React.MouseEvent) => void
  }
}

export function useLongPress({
  onLongPress,
  onClick,
  threshold = LONG_PRESS_DURATION,
  disabled = false
}: UseLongPressOptions): UseLongPressReturn {
  const [isPressed, setIsPressed] = useState(false)
  const [isLongPressed, setIsLongPressed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartPositionRef = useRef<{ x: number; y: number } | null>(null)

  const startTimer = useCallback(() => {
    if (disabled) return
    
    setIsPressed(true)
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true)
      onLongPress()
    }, threshold)
  }, [disabled, threshold, onLongPress])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsPressed(false)
    setIsLongPressed(false)
  }, [])

  const handleMouseDown = useCallback(() => {
    startTimer()
  }, [startTimer])

  const handleMouseUp = useCallback(() => {
    const wasPressed = isPressed && !isLongPressed
    clearTimer()
    if (wasPressed && onClick) {
      onClick()
    }
  }, [isPressed, isLongPressed, onClick, clearTimer])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartPositionRef.current = { x: touch.clientX, y: touch.clientY }
    startTimer()
  }, [startTimer])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPositionRef.current || !timerRef.current) return
    
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPositionRef.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPositionRef.current.y)
    
    // 指が大きく動いた場合は長押しをキャンセル
    if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
      clearTimer()
    }
  }, [clearTimer])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const wasPressed = isPressed && !isLongPressed
    touchStartPositionRef.current = null
    
    if (isLongPressed) {
      e.preventDefault() // 長押し後はタップイベントを防止
    }
    
    clearTimer()
    
    if (wasPressed && onClick) {
      onClick()
    }
  }, [isPressed, isLongPressed, onClick, clearTimer])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsLongPressed(true)
    onLongPress()
  }, [disabled, onLongPress])

  const reset = useCallback(() => {
    clearTimer()
    touchStartPositionRef.current = null
  }, [clearTimer])

  return {
    isPressed,
    isLongPressed,
    reset,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: clearTimer,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
      onContextMenu: handleContextMenu
    }
  }
}