/** Enable only after deploying a same-origin signup endpoint and a reviewed privacy notice. Never store secrets here. */
export const SITE: {
  waitlistEndpoint: string | null;
  privacyUrl: string | null;
} = {
  waitlistEndpoint: null, // Example: "/api/waitlist"
  privacyUrl: null, // Example: "/privacy"
};
