import '@testing-library/jest-dom';

// Polyfill global fetch if needed
if (!global.fetch) {
  // @ts-ignore
  global.fetch = vi.fn();
}
