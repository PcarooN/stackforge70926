# Suggested next implementation slice

These are proposed engineering steps, not completed functionality.

1. Validate demand with real server owners and choose one initial game/framework/version.
2. Define one executable use case (for example: a first-join reward), with server-side permission checks, persistence and replay/duplicate-grant protection.
3. Define a versioned block schema and compatible ports before expanding the catalog. Add schema validation, graph validation, deterministic compilation and golden-file tests.
4. Build a real React Flow editor on that schema. Keep preview state separate from saved project state. Provide keyboard and narrow-screen alternatives.
5. Implement authentication and tenant-scoped storage with authorization tested independently of UI visibility. Do not execute arbitrary generated code in the web request process.
6. Test exported packages on the exact supported game/framework version, then measure build costs and failures.
7. Add a reviewed waitlist/privacy flow. Add billing only after selecting a provider, defining limits and consulting an accountant about the operating jurisdiction.
8. Defer desktop, mobile, marketplace and agency workflows until core demand is demonstrated.
