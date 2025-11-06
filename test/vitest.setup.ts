import '@testing-library/jest-dom/vitest'

globalThis.requestIdleCallback = (callback) => {
  return setTimeout(() => {
    callback({
      timeRemaining: () => 50,
      didTimeout: false,
    })
  }, 1) as unknown as number
}

globalThis.cancelIdleCallback = (id) => {
  clearTimeout(id)
}
