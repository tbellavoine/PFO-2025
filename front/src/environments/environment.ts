// Production defaults. Swapped in automatically for `ng build` (no
// fileReplacement needed since "production" is the default configuration
// — see angular.json's "development" configuration for the override).
//
// TODO: apiBaseUrl is a placeholder. Update it once the back/ API has a
// real deployed URL (docs/plan-dynamic-backend.md §6) — until then,
// production builds of front/ cannot reach the backend.
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.thomasbellavoine.fr',
};
