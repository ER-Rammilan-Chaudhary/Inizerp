
# School ERP Backend v2

This package is a cleaned/refactored backend foundation based on the supplied backend.

## Standard domain module

Every domain module follows exactly:

module/
├── module.controller.ts
├── module.routes.ts
├── module.service.ts
├── module.repository.ts
├── module.validation.ts
└── module.types.ts

Repository owns Prisma access. Service owns business rules. Controller only translates HTTP to service calls. Routes own middleware composition.

## Tenant + feature security

1. authenticate verifies JWT.
2. tenantMiddleware resolves `req.schoolId`.
3. featureGuard verifies that the ERP module is enabled for that school.
4. RBAC middleware/permissions can be composed on routes where a specific action is restricted.

`GET /api/features/me` is the frontend source for the enabled sidebar modules.

## Student portal

`/api/student/*` contains separate folders for each student feature. These are intentionally separated from school-wide domain APIs so frontend screens can be developed independently.

## Generic CRUD

Domain modules expose:
GET /api/<module>
GET /api/<module>/:id
POST /api/<module>
PATCH /api/<module>/:id
DELETE /api/<module>/:id

List supports page, limit, q, sortBy and sortOrder. Tenant ownership is enforced automatically for models with a schoolId field.

## Important integration note

Generic CRUD does not replace specialized workflows such as payment allocation, exam result calculation, inventory stock mutation, payroll processing, library issue/return, or admission approval. Those workflows should be added as explicit service methods under the same module rather than accepting arbitrary relational writes from the generic CRUD endpoint.
