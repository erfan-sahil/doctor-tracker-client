export const siteConfig = {
  name: "Doctor Tracker",
  description: "Track doctors, patients, and clinic activity.",
  routes: {
    home: "/",
    login: "/login",
    dashboard: "/dashboard",
    doctors: "/doctors",
    patients: "/patients",
  },
} as const;
