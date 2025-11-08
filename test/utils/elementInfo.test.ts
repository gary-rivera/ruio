import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import {
  getTagName,
  getReactComponentName,
  calculateElementDepth,
  getChildrenCount,
  getParentTag,
  getParentComponentName,
  getFirstChildTag,
  getFirstChildComponentName,
  getSiblingsCount,
  getElementInfo,
} from '@utils/elementInfo'

describe('elementInfo utilities', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('getTagName', () => {
    test('should return lowercase tag name wrapped in angle brackets', () => {
      const div = document.createElement('div')
      expect(getTagName(div)).toBe('<div>')
    })

    test('should handle different tag types', () => {
      const article = document.createElement('article')
      const span = document.createElement('span')
      const button = document.createElement('button')

      expect(getTagName(article)).toBe('<article>')
      expect(getTagName(span)).toBe('<span>')
      expect(getTagName(button)).toBe('<button>')
    })

    test('should convert uppercase tags to lowercase', () => {
      const section = document.createElement('SECTION')
      expect(getTagName(section)).toBe('<section>')
    })
  })

  describe('getReactComponentName', () => {
    test('should return null for elements without React fiber', () => {
      const div = document.createElement('div')
      expect(getReactComponentName(div)).toBeNull()
    })

    test('should extract component name from React Fiber', () => {
      const div = document.createElement('div')
      ;(div as any).__reactFiber$test = {
        type: function MyComponent() {},
      }

      expect(getReactComponentName(div)).toBe('MyComponent')
    })

    test('should use displayName if available', () => {
      const div = document.createElement('div')
      const ComponentFn = function () {}
      ComponentFn.displayName = 'CustomDisplayName'
      ;(div as any).__reactFiber$test = {
        type: ComponentFn,
      }

      expect(getReactComponentName(div)).toBe('CustomDisplayName')
    })

    test('should return null for string type (native elements)', () => {
      const div = document.createElement('div')
      ;(div as any).__reactFiber$test = {
        type: 'div',
      }

      expect(getReactComponentName(div)).toBeNull()
    })
  })

  describe('calculateElementDepth', () => {
    test('should return 0 for element with no children', () => {
      const div = document.createElement('div')
      expect(calculateElementDepth(div)).toBe(0)
    })

    test('should return 0 for null element', () => {
      expect(calculateElementDepth(null)).toBe(0)
    })

    test('should calculate depth correctly for nested elements', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('div')
      const child2 = document.createElement('div')
      const grandchild = document.createElement('span')

      parent.appendChild(child1)
      child1.appendChild(grandchild)
      parent.appendChild(child2)

      expect(calculateElementDepth(parent)).toBe(2)
    })

    test('should ignore script tags', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      const script = document.createElement('script')
      const scriptChild = document.createElement('div')

      parent.appendChild(child)
      parent.appendChild(script)
      script.appendChild(scriptChild)

      // Script and its children should be ignored
      expect(calculateElementDepth(parent)).toBe(1)
    })

    test('should return MAX_DEPTH_EXCEEDED for very deep trees', () => {
      const root = document.createElement('div')
      let current = root

      // Create a tree deeper than 100 levels
      for (let i = 0; i < 105; i++) {
        const child = document.createElement('div')
        current.appendChild(child)
        current = child
      }

      expect(calculateElementDepth(root)).toBe('MAX_DEPTH_EXCEEDED')
    })
  })

  describe('getChildrenCount', () => {
    test('should return 0 for element with no children', () => {
      const div = document.createElement('div')
      expect(getChildrenCount(div)).toBe(0)
    })

    test('should count only HTML element children', () => {
      const parent = document.createElement('div')
      parent.appendChild(document.createElement('div'))
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createTextNode('text')) // Should be ignored

      expect(getChildrenCount(parent)).toBe(2)
    })

    test('should count all direct children', () => {
      const parent = document.createElement('div')
      parent.appendChild(document.createElement('div'))
      parent.appendChild(document.createElement('div'))
      parent.appendChild(document.createElement('div'))

      expect(getChildrenCount(parent)).toBe(3)
    })
  })

  describe('getParentTag', () => {
    test('should return null for element without parent', () => {
      const div = document.createElement('div')
      expect(getParentTag(div)).toBeNull()
    })

    test('should return parent tag name', () => {
      const parent = document.createElement('section')
      const child = document.createElement('div')
      parent.appendChild(child)

      expect(getParentTag(child)).toBe('<section>')
    })

    test('should return lowercase parent tag', () => {
      const parent = document.createElement('ARTICLE')
      const child = document.createElement('div')
      parent.appendChild(child)

      expect(getParentTag(child)).toBe('<article>')
    })
  })

  describe('getParentComponentName', () => {
    test('should return null for element without parent', () => {
      const div = document.createElement('div')
      expect(getParentComponentName(div)).toBeNull()
    })

    test('should return parent React component name', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)
      ;(parent as any).__reactFiber$test = {
        type: function ParentComponent() {},
      }

      expect(getParentComponentName(child)).toBe('ParentComponent')
    })

    test('should return null if parent has no React fiber', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)

      expect(getParentComponentName(child)).toBeNull()
    })
  })

  describe('getFirstChildTag', () => {
    test('should return null for element with no children', () => {
      const div = document.createElement('div')
      expect(getFirstChildTag(div)).toBeNull()
    })

    test('should return first child tag name', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('div')

      parent.appendChild(child1)
      parent.appendChild(child2)

      expect(getFirstChildTag(parent)).toBe('<span>')
    })

    test('should ignore text nodes and return first HTML element', () => {
      const parent = document.createElement('div')
      parent.appendChild(document.createTextNode('text'))
      const child = document.createElement('button')
      parent.appendChild(child)

      expect(getFirstChildTag(parent)).toBe('<button>')
    })
  })

  describe('getFirstChildComponentName', () => {
    test('should return null for element with no children', () => {
      const div = document.createElement('div')
      expect(getFirstChildComponentName(div)).toBeNull()
    })

    test('should return first child React component name', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)
      ;(child as any).__reactFiber$test = {
        type: function ChildComponent() {},
      }

      expect(getFirstChildComponentName(parent)).toBe('ChildComponent')
    })

    test('should return null if first child has no React fiber', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)

      expect(getFirstChildComponentName(parent)).toBeNull()
    })
  })

  describe('getSiblingsCount', () => {
    test('should return 0 for element without parent', () => {
      const div = document.createElement('div')
      expect(getSiblingsCount(div)).toBe(0)
    })

    test('should return 0 for only child', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)

      expect(getSiblingsCount(child)).toBe(0)
    })

    test('should count siblings correctly', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('div')
      const child2 = document.createElement('div')
      const child3 = document.createElement('div')

      parent.appendChild(child1)
      parent.appendChild(child2)
      parent.appendChild(child3)

      expect(getSiblingsCount(child2)).toBe(2) // child1 and child3
    })

    test('should not count text nodes as siblings', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(document.createTextNode('text'))
      parent.appendChild(child)
      parent.appendChild(document.createTextNode('text'))

      expect(getSiblingsCount(child)).toBe(0)
    })
  })

  describe('getElementInfo', () => {
    test('should return complete element info', () => {
      const parent = document.createElement('div')
      parent.id = 'parent-id'
      const element = document.createElement('article')
      element.className = 'test-class'
      const child = document.createElement('section')

      parent.appendChild(element)
      element.appendChild(child)

      const info = getElementInfo(element)

      expect(info.tagName).toBe('<article>')
      expect(info.parentTag).toBe('<div>')
      expect(info.firstChildTag).toBe('<section>')
      expect(info.selector).toBe('.test-class')
      expect(info.childrenCount).toBe(1)
      expect(info.siblingsCount).toBe(0)
      expect(typeof info.depth).toBe('number')
    })

    test('should handle element with React components', () => {
      const parent = document.createElement('div')
      const element = document.createElement('div')
      const child = document.createElement('div')

      ;(parent as any).__reactFiber$test = {
        type: function ParentComp() {},
      }
      ;(element as any).__reactFiber$test = {
        type: function CurrentComp() {},
      }
      ;(child as any).__reactFiber$test = {
        type: function ChildComp() {},
      }

      parent.appendChild(element)
      element.appendChild(child)

      const info = getElementInfo(element)

      expect(info.reactComponentName).toBe('CurrentComp')
      expect(info.parentComponentName).toBe('ParentComp')
      expect(info.firstChildComponentName).toBe('ChildComp')
    })

    test('should handle element without React components', () => {
      const element = document.createElement('div')

      const info = getElementInfo(element)

      expect(info.reactComponentName).toBeNull()
      expect(info.parentComponentName).toBeNull()
      expect(info.firstChildComponentName).toBeNull()
    })

    test('should handle deeply nested structure', () => {
      const root = document.createElement('div')
      let current = root

      for (let i = 0; i < 5; i++) {
        const child = document.createElement('div')
        current.appendChild(child)
        current = child
      }

      const info = getElementInfo(root)

      expect(info.depth).toBe(5)
      expect(info.childrenCount).toBe(1)
    })
  })
})
