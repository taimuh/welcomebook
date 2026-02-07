import '@testing-library/jest-dom';

// Polyfill for fetch API in Node.js test environment
import { TextEncoder, TextDecoder } from 'util';

Object.assign(globalThis, { TextDecoder, TextEncoder });
