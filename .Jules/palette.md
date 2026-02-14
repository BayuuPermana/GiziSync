## 2025-12-14 - Login Loading & Accessibility
**Learning:** shadcn/ui Button component doesn't have a built-in `loading` prop.
**Action:** Must manually implement loading state using `disabled={loading}` and conditionally rendering a spinner (e.g., `Loader2` from `lucide-react`) inside the button children.
**Learning:** Browser autofill is inconsistent without explicit attributes.
**Action:** Always add `autoComplete="username"` and `autoComplete="current-password"` to login forms to support password managers and accessibility tools.

## 2025-12-15 - Icon-only Buttons & Consistency
**Learning:** Icon-only buttons (like "Back" or "Delete") are common but often lack `aria-label`, making them inaccessible to screen readers.
**Action:** Always check `size="icon"` buttons for `aria-label` or `sr-only` text.
