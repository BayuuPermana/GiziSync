## 2025-12-14 - Login Loading & Accessibility
**Learning:** shadcn/ui Button component doesn't have a built-in `loading` prop.
**Action:** Must manually implement loading state using `disabled={loading}` and conditionally rendering a spinner (e.g., `Loader2` from `lucide-react`) inside the button children.
**Learning:** Browser autofill is inconsistent without explicit attributes.
**Action:** Always add `autoComplete="username"` and `autoComplete="current-password"` to login forms to support password managers and accessibility tools.

## 2025-12-15 - File Input Accessibility
**Learning:** shadcn/ui Input component is not suitable for hidden file inputs as it applies styles that conflict with sr-only. Native <input> is better.
**Action:** Use <input type="file" className="sr-only peer" /> combined with peer-focus-visible on the label for accessible custom file uploads.
