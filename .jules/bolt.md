# Bolt's Journal

This journal tracks critical performance learnings for the GiziSync project.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [Insight]`
`**Action:** [How to apply next time]`

## 2024-05-22 - Mongoose .lean() Optimization
**Learning:** The project uses Mongoose for database interactions. Read-only endpoints (`GET /kitchens`, `GET /reports`) were returning full Mongoose documents, which include internal state and methods, increasing memory usage and serialization time.
**Action:** Applied `.lean()` to standard `find()` queries that are strictly read-only and return JSON directly. This ensures the backend returns plain JavaScript objects (POJOs), significantly reducing overhead for list endpoints. verified that `populate()` works correctly with `.lean()`.
