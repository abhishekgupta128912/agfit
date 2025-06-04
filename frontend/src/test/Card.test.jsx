import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'

describe('Card Component', () => {
  it('renders card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-white', 'rounded-xl', 'border-gray-200')
  })

  it('applies primary variant styles', () => {
    render(<Card variant="primary" data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('border-primary-200', 'bg-primary-50')
  })

  it('applies hover effects when enabled', () => {
    render(<Card hover data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('hover:shadow-md', 'hover:-translate-y-0.5', 'cursor-pointer')
  })

  it('applies different padding sizes', () => {
    const { rerender } = render(<Card padding="sm" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('p-4')

    rerender(<Card padding="lg" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('p-8')
  })
})

describe('Card Sub-components', () => {
  it('renders CardHeader with border', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('border-b', 'border-gray-200', 'pb-4', 'mb-6')
  })

  it('renders CardTitle with proper styling', () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900')
  })

  it('renders CardDescription with muted text', () => {
    render(<CardDescription>Description</CardDescription>)
    const description = screen.getByText('Description')
    expect(description).toHaveClass('text-sm', 'text-gray-600', 'mt-1')
  })

  it('renders CardContent as container', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('renders CardFooter with border', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('border-t', 'border-gray-200', 'pt-4', 'mt-6')
  })
})
