import '@testing-library/jest-dom' // Provides additional matchers for testing library


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