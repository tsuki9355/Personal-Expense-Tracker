// Adds DOM checks such as expect(element).toBeInTheDocument() to Vitest
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Remove whatever the previous test rendered, so tests don't affect each other
afterEach(() => {
  cleanup();
});
