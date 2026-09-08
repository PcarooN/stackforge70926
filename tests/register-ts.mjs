// Test-only resolution. App imports stay compatible with the existing Next.js project.
// Requires Node 22.18+ (Node 24 recommended).
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './blueprint' && context.parentURL?.endsWith('/lib/workspace.ts')) {
      return nextResolve('./blueprint.ts', context);
    }
    return nextResolve(specifier, context);
  }
});
