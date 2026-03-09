const formatConsoleArg = (value: unknown): string => {
  if (value instanceof Error) {
    return value.stack ?? value.message;
  }

  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const originalConsoleError = console.error.bind(console) as (
  ...args: unknown[]
) => void;

console.error = (...args: unknown[]) => {
  originalConsoleError(...args);

  throw new Error(
    [
      'Unexpected console.error during test execution:',
      ...args.map(formatConsoleArg),
    ].join('\n'),
  );
};
