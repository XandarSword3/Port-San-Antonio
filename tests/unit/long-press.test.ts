import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Long-press logic implementation
class LongPressHandler {
  private timer: NodeJS.Timeout | null = null
  private readonly duration = 3000 // 3 seconds
  private onSuccess: () => void
  private onCancel: () => void

  constructor(onSuccess: () => void, onCancel: () => void) {
    this.onSuccess = onSuccess
    this.onCancel = onCancel
  }

  handlePointerDown() {
    this.cancel() // Cancel any existing timer
    this.timer = setTimeout(() => {
      this.onSuccess()
      this.timer = null
    }, this.duration)
  }

  handlePointerUp() {
    this.cancel()
  }

  handlePointerLeave() {
    this.cancel()
  }

  handlePointerCancel() {
    this.cancel()
  }

  private cancel() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
      this.onCancel()
    }
  }

  destroy() {
    this.cancel()
  }
}

describe('Long Press Logic', () => {
  let mockOnSuccess: ReturnType<typeof vi.fn>
  let mockOnCancel: ReturnType<typeof vi.fn>
  let handler: LongPressHandler

  beforeEach(() => {
    mockOnSuccess = vi.fn()
    mockOnCancel = vi.fn()
    handler = new LongPressHandler(mockOnSuccess, mockOnCancel)
    vi.useFakeTimers()
  })

  afterEach(() => {
    handler.destroy()
    vi.useRealTimers()
  })

  describe('Successful Long Press', () => {
    it('should trigger success after 3 seconds', () => {
      handler.handlePointerDown()
      
      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).not.toHaveBeenCalled()

      // Fast-forward 3 seconds
      vi.advanceTimersByTime(3000)

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(mockOnCancel).not.toHaveBeenCalled()
    })

    it('should not trigger success before 3 seconds', () => {
      handler.handlePointerDown()
      
      // Fast-forward 2.9 seconds
      vi.advanceTimersByTime(2900)

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).not.toHaveBeenCalled()
    })
  })

  describe('Cancelled Long Press', () => {
    it('should cancel on pointer up before 3 seconds', () => {
      handler.handlePointerDown()
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000)
      
      handler.handlePointerUp()

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should cancel on pointer leave before 3 seconds', () => {
      handler.handlePointerDown()
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000)
      
      handler.handlePointerLeave()

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should cancel on pointer cancel before 3 seconds', () => {
      handler.handlePointerDown()
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000)
      
      handler.handlePointerCancel()

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Multiple Interactions', () => {
    it('should cancel previous timer when starting new long press', () => {
      handler.handlePointerDown()
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000)
      
      // Start new long press (this should cancel the first one)
      handler.handlePointerDown()
      
      // Fast-forward 1 second (2 seconds total from first, 1 second from second)
      vi.advanceTimersByTime(1000)
      
      handler.handlePointerUp()

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(2) // First cancelled, then second cancelled
    })

    it('should handle rapid pointer down/up cycles', () => {
      // Rapid cycles
      handler.handlePointerDown()
      handler.handlePointerUp()
      handler.handlePointerDown()
      handler.handlePointerUp()
      handler.handlePointerDown()
      handler.handlePointerUp()

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle pointer up after success', () => {
      handler.handlePointerDown()
      
      // Fast-forward 3 seconds to trigger success
      vi.advanceTimersByTime(3000)
      
      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      
      // Pointer up after success should not cause issues
      handler.handlePointerUp()
      
      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(mockOnCancel).not.toHaveBeenCalled()
    })

    it('should handle multiple pointer up calls', () => {
      handler.handlePointerDown()
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000)
      
      handler.handlePointerUp()
      handler.handlePointerUp() // Second call should be safe
      handler.handlePointerUp() // Third call should be safe

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(1) // Only called once
    })

    it('should handle destroy during active timer', () => {
      handler.handlePointerDown()
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000)
      
      handler.destroy()

      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Timer Management', () => {
    it('should not create multiple timers', () => {
      handler.handlePointerDown()
      handler.handlePointerDown() // Should cancel previous
      handler.handlePointerDown() // Should cancel previous
      
      // Fast-forward 3 seconds
      vi.advanceTimersByTime(3000)

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(mockOnCancel).toHaveBeenCalledTimes(2) // Two cancellations
    })

    it('should clean up timer on success', () => {
      handler.handlePointerDown()
      
      // Fast-forward 3 seconds
      vi.advanceTimersByTime(3000)
      
      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      
      // Timer should be cleaned up, so no more calls
      vi.advanceTimersByTime(1000)
      
      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    })
  })
})
