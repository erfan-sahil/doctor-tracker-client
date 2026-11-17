import type { PublicUser } from "@/features/auth/model/types";

export type Doctor = {
  id: string;
  name: string;
  phone: string;
  specialization: string | null;
  hospital: string | null;
};

export type DoctorWithUser = {
  doctor: Doctor;
  user: PublicUser;
};

export type DoctorAccount = DoctorWithUser;

export type PaginatedDoctors = {
  doctors: DoctorWithUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListDoctorsParams = {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
};

export type DoctorFilterOptions = {
  specializations: string[];
  hospitals: string[];
};

export type CreateDoctorInput = {
  name: string;
  phone: string;
  email: string;
  password: string;
  specialization?: string;
  hospital?: string;
};

export type UpdateDoctorInput = {
  name?: string;
  phone?: string;
  specialization?: string | null;
  hospital?: string | null;
};
