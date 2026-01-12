## 2025-12-14 - Login Loading & Accessibility
**Learning:** shadcn/ui Button component doesn't have a built-in `loading` prop.
**Action:** Must manually implement loading state using `disabled={loading}` and conditionally rendering a spinner (e.g., `Loader2` from `lucide-react`) inside the button children.
**Learning:** Browser autofill is inconsistent without explicit attributes.
**Action:** Always add `autoComplete="username"` and `autoComplete="current-password"` to login forms to support password managers and accessibility tools.

## 2026-01-12 - Icon-only Button Accessibility
**Learning:** Icon-only buttons (using `size="icon"`) are invisible to screen readers if they lack an accessible name, creating a "button" announcement with no context.
**Action:** Always add `aria-label` to any `Button` component using `size="icon"`. For list items (like delete/edit), include the item name in the label (e.g., `aria-label={"Edit " + item.name}`) for better context.
