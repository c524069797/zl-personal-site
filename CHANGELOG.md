# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2026-01-30] - Blog Experience Upgrade & Stability Fixes
### Added
- **Reading Time**: Added estimated reading time to blog posts (list & detail views).
- **Back to Top**: Implemented a floating "Scroll to Top" button on article pages.
- **Interactive AI Chat**: Replaced static prompts with clickable interactive tags for better UX.

### Fixed
- **API Stability**: Resolved critical `500 Internal Server Error` (Prisma connection issues) in `latest`, `hot`, and `posts` APIs.
- **Syntax Errors**: Fixed JSX parsing issues in `HomePage.tsx`.
- **Localization**: Corrected i18n implementation to support default value fallbacks.

## [2026-01-28] - Resume Feature Fixes
### Fixed
- **PDF Download**: Fixed Chinese font rendering issues in Resume PDF download generation.

## [2025-11-30] - SEO & Content Optimization
### Added
- **SEO**: Enhanced structured data (JSON-LD) for better search engine indexing.
- **Content**: Updated personal profile and added new blog posts regarding PostgreSQL.

## [2025-11-28] - Homepage Visual Refresh
### Changed
- **Visuals**: Updated homepage background imagery.
- **Mobile**: Optimized responsive layout for better mobile experience.

## [2025-11-21] - Major Feature Rollout: Categories & AI Tools
### Added
- **Categories**: Introduced blog categories ("Tech" vs "Life") with migration scripts.
- **AI Tools**: Added comprehensive guides for AI tools (Cursor, MCP Tools).
- **Favicon**: Standardized site favicon implementation.
- **Tags**: Enhanced tag filtering and display logic in sidebar.
