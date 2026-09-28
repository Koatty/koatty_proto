# Changelog

## 2.0.0

### Minor Changes

- Phase B security hardening (koatty-hardening-and-ai-evolution-plan.md, ADR-101/102/103). Fail-closed defaults with a `security.legacyDefaults: true` rollback switch; see docs/migration/4.3.0.md for the full migration guide.

  Highlights:
  - SecurityProfile (strict/standard/development) exposed read-only as `app.security`, with a startup summary and per-item WARN when rolling back
  - body parsing failures return 400/413/415 instead of silently producing `{}`; body size limit follows the security profile (1mb in production)
  - DTO validation whitelist on by default (strict profile rejects unknown fields); `__proto__`/`constructor` keys never reach DTO instances
  - AOP aspect failures abort the business method unless opted out via `{ onError: 'log' }` or `app.security.aop.onAspectError`
  - After/AfterEach aspects receive the business result via `options.result`
  - GraphQL: profile-driven playground/introspection/depth limits, built-in depth rule, optional complexity package fails startup when configured but missing, CDN-free GraphiQL
  - uploads: profile-driven maxFiles/maxFields/maxFieldsSize, keepExtensions defaults off, array-aware temp cleanup, new `safeFilename` export
  - ops endpoints: minimal liveness body, /ready 503 while draining, /metrics behind the exposeMetrics policy (loopback/RFC1918/allowCidrs/token), Prometheus bound to 127.0.0.1, rateLimit middleware wired (default off)
  - request IDs validated (`[A-Za-z0-9._:-]{1,128}`), query fallback disabled, structured access logs, topology service header opt-in
  - WebSocket: profile maxPayload, perMessageDeflate off, Origin check, connection limits, error-message redaction, slow-consumer guard, timer cleanup on destroy
  - TLS minVersion TLSv1.2 by default; TypeORM production logs errors only with sensitive-parameter redaction; Swagger disabled in production by default
  - defect fixes: escapeHtml (&-escaping, valid entities), ReDoS-safe isNumberString, plugin run() executes once, bootstrap failures propagate, Redis default port 6379, gRPC ListServices, koatty_cli bin (CJS build), RedLocker.resetInstance, config() write loss, CLI sandbox + `apply` dry-run by default

### Patch Changes

- Updated dependencies
  - koatty_lib@1.6.0

## 1.4.0

### Minor Changes

- build
- build

### Patch Changes

- Updated dependencies
- Updated dependencies
  - koatty_lib@1.5.0

## 1.3.9

### Patch Changes

- build
- Updated dependencies
  - koatty_lib@1.4.9

## 1.3.8

### Patch Changes

- Updated dependencies
  - koatty_lib@1.4.8

## 1.3.7

### Patch Changes

- build
- Updated dependencies
  - koatty_lib@1.4.7

## 1.3.6

### Patch Changes

- patch version bump for koatty, koatty_cacheable, koatty_config, koatty_container, koatty_core, koatty_exception, koatty_graphql, koatty_lib, koatty_loader, koatty_logger, koatty_proto, koatty_router, koatty_schedule, koatty_serve, koatty_store, koatty_trace, koatty_typeorm, koatty_validation
- Updated dependencies
  - koatty_lib@1.4.6

## 1.3.5

### Patch Changes

- build
- Updated dependencies
  - koatty_lib@1.4.5

## 1.3.4

### Patch Changes

- build
- Updated dependencies
  - koatty_lib@1.4.4

## 1.3.3

### Patch Changes

- build
- Updated dependencies
  - koatty_lib@1.4.3

## 1.3.2

### Patch Changes

- build

## 1.3.1

### Patch Changes

- Updated dependencies
  - koatty_lib@1.4.2

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/Koatty/koatty_proto/compare/v1.2.0...v1.3.0) (2025-06-09)

### Features

- add circular reference detection in parsing functions and ListServices ([e6c8c4e](https://github.com/Koatty/koatty_proto/commit/e6c8c4eb9849e0a70a72fbf3da269e9e4327c177))

## [1.2.0](https://github.com/Koatty/koatty_proto/compare/v1.1.14...v1.2.0) (2024-11-06)

### [1.1.14](https://github.com/Koatty/koatty_proto/compare/v1.1.13...v1.1.14) (2024-10-31)

### [1.1.13](https://github.com/Koatty/koatty_proto/compare/v1.1.12...v1.1.13) (2024-04-14)

### [1.1.12](https://github.com/Koatty/koatty_proto/compare/v1.1.11...v1.1.12) (2023-07-22)

### [1.1.11](https://github.com/Koatty/koatty_proto/compare/v1.1.10...v1.1.11) (2023-02-26)

### [1.1.10](https://github.com/Koatty/koatty_proto/compare/v1.1.9...v1.1.10) (2023-01-13)

### [1.1.9](https://github.com/Koatty/koatty_proto/compare/v1.1.8...v1.1.9) (2022-10-31)

### Bug Fixes

- upgrade deps ([06fc115](https://github.com/Koatty/koatty_proto/commit/06fc1157b4bc2014a49a240626a7280b808d2acd))

### [1.1.8](https://github.com/Koatty/koatty_proto/compare/v1.1.7...v1.1.8) (2022-05-27)

### [1.1.7](https://github.com/Koatty/koatty_proto/compare/v1.1.6...v1.1.7) (2022-05-26)

### [1.1.6](https://github.com/Koatty/koatty_proto/compare/v1.1.4...v1.1.6) (2022-02-16)

### [1.1.4](https://github.com/Koatty/koatty_proto/compare/v1.0.18...v1.1.4) (2021-12-13)

### [1.0.18](https://github.com/Koatty/koatty_proto/compare/v1.0.16...v1.0.18) (2021-12-13)

### [1.0.16](https://github.com/Koatty/koatty_proto/compare/v1.0.14...v1.0.16) (2021-11-30)

### [1.0.14](https://github.com/Koatty/koatty_proto/compare/v1.0.12...v1.0.14) (2021-11-24)

### [1.0.12](https://github.com/Koatty/koatty_proto/compare/v1.0.10...v1.0.12) (2021-11-24)

### [1.0.10](https://github.com/Koatty/koatty_proto/compare/v1.0.8...v1.0.10) (2021-11-24)

### [1.0.8](https://github.com/Koatty/koatty_proto/compare/v1.0.6...v1.0.8) (2021-11-24)

### [1.0.6](https://github.com/Koatty/koatty_proto/compare/v1.0.4...v1.0.6) (2021-11-24)

### [1.0.4](https://github.com/Koatty/koatty_proto/compare/v1.0.2...v1.0.4) (2021-11-24)

### 1.0.2 (2021-11-24)
