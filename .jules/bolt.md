# Bolt's Journal

This journal tracks critical performance learnings for the GiziSync project.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [Insight]`
`**Action:** [How to apply next time]`

## 2024-05-23 - Payload Reduction via Field Selection
**Learning:** Excluding the `items` array from the main reports list view reduces the payload size by approximately 91% (from ~308KB to ~28KB for 100 records).
**Action:** Always inspect document structure for list views and use `.select('-field')` to exclude large arrays, fetching them only on demand via a detail endpoint.

## 2024-05-23 - Frontend Race Condition with Async Fetch
**Learning:** When fetching details asynchronously for a selected item (e.g., a modal), network latency can cause a race condition where a slower response for a previous selection overwrites the current selection.
**Action:** Use functional state updates with a check (e.g., `setReport(current => current._id === id ? data : current)`) to ensure the response matches the active context.
