## 2024-05-23 - Accessibility of Hidden File Inputs
**Learning:** Using `display: none` (or Tailwind's `hidden`) on a file input removes it from the accessibility tree, making it impossible for keyboard-only users to upload files.
**Action:** Use `.sr-only` (screen reader only) combined with `.peer` on the input, and `.peer-focus-visible:ring` on the custom label to ensure the input remains focusable and provides visual feedback when focused via keyboard.
