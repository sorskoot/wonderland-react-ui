# Wonderland React UI — Documentation Index

A concise guide to the documentation for the wonderland-react-ui package. Use these pages to get started, understand architecture and internals, and learn how to build, test, and contribute.

- Getting started
  - Installation — docs/installation.md — How to add the package to your project and peer dependency notes.
  - Quick start — docs/quick-start.md — Minimal example to render UI in Wonderland Engine.
  - Example app — example/ — A runnable example and prebuilt deploy artifacts.

- Concepts & Overview
  - Architecture — docs/architecture.md — High-level design: React custom renderer, scene graph, Yoga layout separation.
  - Theming — [docs/theming.md](./theming.md) — Styling and material contexts
  - Components — docs/components.md — Button, Text, Panel, Column/Row, Image, ProgressBar and their props.
  - Layout & Yoga — docs/layout.md — Yoga usage, sizing rules, percent vs fixed, and layout helpers.
  - Renderer internals — docs/renderer.md — reconciler, mesh/material creation, transforms, and updates.
  - Text & Mesh — docs/text-and-mesh.md — text rendering, nine-slice and rounded rectangle meshes.

- API and References
  - Public API — js/index.ts and dist/ — exports and package shape.
  - Component props reference — docs/api/components.md — props and types for public components.
  - Utilities — docs/api/utils.md — helper functions and common utilities.

- Development & Testing
  - Build & watch — npm run build, npm run watch — Build and iterate locally.
  - Unit & integration tests — npm run test:unit, npm run test, npm run test:ci — Vitest and web-test-runner workflows.
  - Contributing — docs/contributing.md — repo conventions, coding style, and testing expectations.

- Examples, Tests & Resources
  - Example app — example/ — Editor project and deploy artifacts used by integration tests.
  - Tests — test/unit/ — Unit test patterns and locations.
  - Changelog — CHANGELOG.md
  - License — LICENSE
  - FAQ & Troubleshooting — docs/faq.md
