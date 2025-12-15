## 2025-12-14 - Login Loading & Accessibility
**Learning:** shadcn/ui Button component doesn't have a built-in `loading` prop.
**Action:** Must manually implement loading state using `disabled={loading}` and conditionally rendering a spinner (e.g., `Loader2` from `lucide-react`) inside the button children.
**Learning:** Browser autofill is inconsistent without explicit attributes.
**Action:** Always add `autoComplete="username"` and `autoComplete="current-password"` to login forms to support password managers and accessibility tools.

## 2025-12-14 - Icon-Only Buttons
**Learning:** Icon-only buttons (like Edit/Trash) rely on visual context and are invisible to screen readers.
**Action:** Always add `aria-label` describing the action (e.g., "Edit kitchen") to `Button` components with `size="icon"`.
