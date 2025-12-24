# Bolt's Journal

This journal tracks critical performance learnings for the GiziSync project.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [Insight]`
`**Action:** [How to apply next time]`

## 2024-05-22 - [Aggregation Optimization with Indexes]
**Learning:** MongoDB Aggregation `$sort` followed by `$group` can be optimized by using a compound index that matches the sort order (e.g., `{ groupField: 1, sortField: -1 }`). This allows MongoDB to stream the group operation rather than sorting in memory, which is critical for scalability.
**Action:** When aggregating "latest N per group", always ensure a compound index exists and the `$sort` stage aligns with it before the `$group` stage.
