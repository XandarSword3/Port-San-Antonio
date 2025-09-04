import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilterChips from '../src/components/FilterChips'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}))

describe('FilterChips', () => {
  const mockFilters = [
    { id: 'vegetarian', label: 'Vegetarian', active: true },
    { id: 'vegan', label: 'Vegan', active: false },
    { id: 'gluten-free', label: 'Gluten Free', active: true }
  ]

  const mockOnFilterToggle = jest.fn()
  const mockOnClearAll = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders nothing when no active filters', () => {
    const filters = mockFilters.map(f => ({ ...f, active: false }))
    
    const { container } = render(
      <FilterChips
        filters={filters}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={false}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  test('renders nothing when hasActiveFilters is false', () => {
    const { container } = render(
      <FilterChips
        filters={mockFilters}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={false}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  test('renders active filter chips when hasActiveFilters is true', () => {
    render(
      <FilterChips
        filters={mockFilters}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={true}
      />
    )
    
    expect(screen.getByText('Filters:')).toBeInTheDocument()
    expect(screen.getByText('Vegetarian')).toBeInTheDocument()
    expect(screen.getByText('Gluten Free')).toBeInTheDocument()
    expect(screen.queryByText('Vegan')).not.toBeInTheDocument() // Not active
    expect(screen.getByText('Clear all')).toBeInTheDocument()
  })

  test('calls onFilterToggle when filter chip is clicked', () => {
    render(
      <FilterChips
        filters={mockFilters}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={true}
      />
    )
    
    fireEvent.click(screen.getByText('Vegetarian'))
    expect(mockOnFilterToggle).toHaveBeenCalledWith('vegetarian')
  })

  test('calls onClearAll when clear all button is clicked', () => {
    render(
      <FilterChips
        filters={mockFilters}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={true}
      />
    )
    
    fireEvent.click(screen.getByText('Clear all'))
    expect(mockOnClearAll).toHaveBeenCalled()
  })

  test('handles empty filters array gracefully', () => {
    const { container } = render(
      <FilterChips
        filters={[]}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={false}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  test('handles undefined filters gracefully', () => {
    const { container } = render(
      <FilterChips
        filters={undefined}
        onFilterToggle={mockOnFilterToggle}
        onClearAll={mockOnClearAll}
        hasActiveFilters={false}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })
})
