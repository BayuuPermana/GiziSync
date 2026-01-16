# Bolt's Journal

This journal tracks critical performance learnings for the GiziSync project.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [Insight]`
`**Action:** [How to apply next time]`

## 2024-05-22 - React Component Redefinition Anti-pattern
**Learning:** Found `SortableHead` defined inside `ReportsPage`, causing full unmount/remount on every state change (like typing in search). This is a silent performance killer in React.
**Action:** Always scan for components defined inside other components during exploration. Extract them and use `React.memo` + `useCallback` for props.
