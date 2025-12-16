# Bolt's Journal

This journal tracks critical performance learnings for the GiziSync project.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [Insight]`
`**Action:** [How to apply next time]`

## 2024-05-23 - Backend: Mongoose Lean Queries
**Learning:** Using `.lean()` on read-only Mongoose queries provides a significant performance boost by skipping the hydration of full Mongoose Documents. This also simplifies data handling by returning POJOs, allowing direct object destructuring (avoiding `._doc`).
**Action:** Always apply `.lean()` to `find` and `findOne` queries in `GET` routes that do not require document instance methods (like `save`).
