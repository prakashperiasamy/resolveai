# Implementation notes

## Packaging changes

The original editable application was separated from its hosting starter and packaged as a standard React/TypeScript/Vite client. Hosting credentials, source repository history, integration adapters, unused UI scaffolding, and deployment configuration were excluded. The existing offline dashboard was retained so reviewers can run the demo without installing dependencies.

The synthetic data generator and query/filter/export functions were moved into src/lib/escalations.ts and are shared by the dashboard, tests, and sample-data exporter. The UI uses the same original case-generation and query rules.

## Important behavior

- Browser session state clears on reload; exports provide a local record.
- Query responses use supported keyword rules rather than general language understanding.
- Unrecognized questions currently return the default active-case briefing. Reported downtime is fictional, and is not converted into a financial estimate. The case timelines are simplified fixtures.
- The archived offline HTML is a distributable artifact; use the TypeScript source for ongoing development.
- Original engineering context and terminology were preserved.

## Validation limit

Fresh browser visual and interaction QA could not run in the current environment. Passing TypeScript, production-build, domain, and server-rendering checks does not establish browser interaction correctness. Before broad distribution, manually follow the walkthrough on desktop and mobile, inspect charts and dialogs, run exports, and test keyboard navigation.
