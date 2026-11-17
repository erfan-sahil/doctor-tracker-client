export const siteConfig = {
  name: "Doctor Tracker",
  description: "Track doctors, patients, and clinic activity.",
  routes: {
    home: "/",
    login: "/login",
    overview: "/overview",
    doctors: "/doctors",
    patients: "/patients",
  },
} as const;
