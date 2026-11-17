export type Patient = {
  id: string;
  name: string;
  doctorId: string;
  condition: string | null;
  date: string | null;
};

export type PaginatedPatients = {
  patients: Patient[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PatientFilterDoctorOption = {
  id: string;
  name: string;
  email: string;
};

export type PatientFilterOptions = {
  conditions: string[];
};

export type ListPatientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  doctorId?: string;
  condition?: string;
  date?: string;
};

export type CreatePatientInput = {
  name: string;
  condition?: string | null;
  date?: string | null;
  doctorId?: string;
};

export type UpdatePatientInput = {
  name?: string;
  condition?: string | null;
  date?: string | null;
  doctorId?: string;
};
