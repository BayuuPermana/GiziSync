## 2025-12-14 - Login Loading & Accessibility
**Learning:** shadcn/ui Button component doesn't have a built-in `loading` prop.
**Action:** Must manually implement loading state using `disabled={loading}` and conditionally rendering a spinner (e.g., `Loader2` from `lucide-react`) inside the button children.
**Learning:** Browser autofill is inconsistent without explicit attributes.
**Action:** Always add `autoComplete="username"` and `autoComplete="current-password"` to login forms to support password managers and accessibility tools.

## 2025-05-22 - Improving Accessibility in Dynamic Forms
**Learning:** Hidden inputs (`display: none`) often remove elements from the accessibility tree. Using `sr-only` keeps them accessible. However, to provide focus feedback for keyboard users, we can use the `peer` class on the input and `peer-focus-visible` on the associated label to show a focus ring when the hidden input is focused.
**Action:** When creating custom file inputs or "styled" inputs that hide the native element, always use `sr-only` and ensure the visual trigger has a focus state linked to the hidden input's focus state.
