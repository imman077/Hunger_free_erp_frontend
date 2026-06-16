/**
 * Helper to restrict input keystrokes based on validation rules.
 */
export function inputValidator(options: {
  allowAlphanumeric?: boolean;
  allowSpace?: boolean;
  allowSpecial?: boolean;
  onlyNumbers?: boolean;
  onlyAlphabets?: boolean;
  noSpace?: boolean;
  maxDigits?: number;
}) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;

    // Control keys (Backspace, Delete, Arrow keys, etc.) should always be allowed
    if (char.length > 1) {
      return;
    }

    if (options.onlyNumbers) {
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
        return;
      }
    }

    if (options.onlyAlphabets) {
      if (options.allowSpace && char === " ") {
        return;
      }
      if (!/[a-zA-Z]/.test(char)) {
        e.preventDefault();
        return;
      }
    }

    if (options.noSpace && char === " ") {
      e.preventDefault();
      return;
    }

    if (options.allowAlphanumeric && !options.allowSpecial) {
      if (options.allowSpace && char === " ") {
        return;
      }
      if (!/[a-zA-Z0-9]/.test(char)) {
        e.preventDefault();
        return;
      }
    }
  };
}
