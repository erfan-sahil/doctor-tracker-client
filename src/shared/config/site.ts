export const siteConfig = {
  name: "Doctor Tracker",
  description: "Track doctors, patients, and clinic activity.",
  /** Favicon + sidebar mark */
  brandIcon: "/logo/logo.webp",
  /** Sign-in wordmark (light theme) */
  loginLogo: "/logo/doctor-tracker-logo-light.webp",
  /** Sign-in wordmark (dark theme) */
  loginLogoDark: "/logo/doctor-tracker-logo-dark.webp",
  routes: {
    login: "/login",
    overview: "/overview",
    doctors: "/doctors",
    patients: "/patients",
  },
} as const;
