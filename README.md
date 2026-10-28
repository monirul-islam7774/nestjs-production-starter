# NestJS Production Starter

![CI](https://github.com/monirul-islam7774/nestjs-production-starter/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-22-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-ready REST API template built with **NestJS**, **TypeORM** and **PostgreSQL**. It includes what a real service needs from the start: authentication, validation, consistent error handling, rate limiting, health checks, API docs, Docker and CI.

## Features

| Area | What's included |
| --- | --- |
| Auth | Register / login with **JWT** (Passport), bcrypt password hashing, protected routes, `@CurrentUser()` decorator |
| Security | Helmet headers, CORS, global rate limiting + stricter login throttle (brute-force protection), no user enumeration |
| Validation | `class-validator` DTOs, whitelist + forbid unknown fields, env validation with **Joi** (app fails fast on bad config) |
| Errors | Global exception filter with one consistent JSON error shape, no stack traces leaked |
| Observability | Request logging interceptor, `/health` endpoint with DB ping (Kubernetes-ready) |
| Docs | Swagger / OpenAPI at `/docs` |
| API design | URI versioning (`/v1/...`) |
| DevOps | Multi-stage Dockerfile (non-root user, healthcheck), Docker Compose, GitHub Actions CI |
| Testing | Jest unit tests with mocked repositories + Supertest e2e test |

## Architecture

```
src/
├── main.ts                 # bootstrap: helmet, validation, versioning, swagger
├── app.module.ts           # config, TypeORM, throttler, feature modules
├── config/                 # env validation schema
├── common/                 # exception filter, logging interceptor
├── auth/                   # JWT strategy, guard, login/register
├── users/                  # User entity, service, /users/me
└── health/                 # Terminus health checks
```

## Getting started

```bash
cp .env.example .env
docker compose up -d postgres     # start PostgreSQL
npm install
npm run start:dev                 # http://localhost:3000, docs at /docs
```

Or run everything in Docker:

```bash
docker compose up --build
```

### Try it

```bash
curl -X POST localhost:3000/v1/auth/register -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","name":"Jane","password":"S3cure-passw0rd"}'

TOKEN=$(curl -s -X POST localhost:3000/v1/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","password":"S3cure-passw0rd"}' | jq -r .accessToken)

curl localhost:3000/v1/users/me -H "Authorization: Bearer $TOKEN"
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Run with hot reload |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests (needs PostgreSQL) |
| `npm run lint` | ESLint |
| `npm run build` | Compile to `dist/` |

## Roadmap

- [ ] Refresh tokens with rotation and revocation
- [ ] Role-based access control (`@Roles()` guard)
- [ ] TypeORM migrations instead of `synchronize`
- [ ] Structured JSON logging (Pino) with request IDs
- [ ] Redis cache and Redis-backed rate limiting
- [ ] OpenTelemetry tracing

## License

MIT © Md. Monirul Islam
