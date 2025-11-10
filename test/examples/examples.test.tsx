import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BlogApp from '../../examples/blog/App'
import ViteSimpleApp from '../../examples/vite-simple/App'

// Mock the outline utilities
vi.mock('@utils/outline', async () => {
  const actual = await vi.importActual<typeof import('@utils/outline')>('@utils/outline')
  return {
    ...actual,
    applySelectedOutlines: vi.fn(),
    clearCommittedOutlines: vi.fn(),
    applyPreviewOutlines: vi.fn(),
    clearPreviewOutlines: vi.fn(),
    resetCommittedOutlines: vi.fn(),
  }
})

vi.mock('@controllers/ElementPicker', () => ({
  ElementPicker: vi.fn(() => vi.fn()),
}))

describe('Example Applications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Blog Example', () => {
    it('should render the blog example without crashing', () => {
      const { container } = render(<BlogApp />)
      expect(container).toBeInTheDocument()
    })

    it('should render the ruio UI container', () => {
      render(<BlogApp />)
      const ruioContainer = document.querySelector('[data-testid="ruio-ui-container"]')
      expect(ruioContainer).toBeInTheDocument()
    })

    it('should render the main blog layout', () => {
      render(<BlogApp />)
      const blogLayout = document.querySelector('.blog-layout')
      expect(blogLayout).toBeInTheDocument()
    })

    it('should render the main content area', () => {
      render(<BlogApp />)
      const mainContent = document.querySelector('#main-content')
      expect(mainContent).toBeInTheDocument()
    })
  })

  describe('Vite Simple Example', () => {
    it('should render the vite-simple example without crashing', () => {
      const { container } = render(<ViteSimpleApp />)
      expect(container).toBeInTheDocument()
    })

    it('should render the ruio UI container', () => {
      render(<ViteSimpleApp />)
      const ruioContainer = document.querySelector('[data-testid="ruio-ui-container"]')
      expect(ruioContainer).toBeInTheDocument()
    })

    it('should render with ruio wrapper applied', () => {
      const { container } = render(<ViteSimpleApp />)
      // The app should render with its content
      expect(container.firstChild).toBeTruthy()
    })
  })
})
