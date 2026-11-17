export type UserRole = "admin" | "doctor";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  doctorId: string | null;
  isActive: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  user: PublicUser;
};

export type RefreshResult = {
  accessToken: string;
};

export type Session = {
  user: PublicUser;
  accessToken: string;
};
