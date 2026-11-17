export type DashboardGroupBy = "day" | "month";

export type DashboardParams = {
  from?: string;
  to?: string;
  groupBy?: DashboardGroupBy;
};

export type DashboardDoctorStat = {
  doctorId: string;
  name: string;
  specialization: string | null;
  hospital: string | null;
  patientCount: number;
};

export type DashboardDateStat = {
  date: string;
  count: number;
};

export type DashboardConditionStat = {
  condition: string | null;
  count: number;
};

export type Dashboard = {
  totalDoctors: number;
  totalPatients: number;
  patientsPerDoctor: DashboardDoctorStat[];
  patientsByDate: DashboardDateStat[];
  patientsByCondition: DashboardConditionStat[];
};
