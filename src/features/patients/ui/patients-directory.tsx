"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState, VisibilityState } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useSessionStore } from "@/features/auth/model/session-store";
import { doctorsQuery } from "@/features/doctors/queries/doctors";
import { toDoctorRosterOptions } from "@/features/patients/lib/to-doctor-roster-options";
import type { ListPatientsParams, Patient } from "@/features/patients/model/types";
import { patientFilterOptionsQuery, patientsQuery } from "@/features/patients/queries/patients";
import { CreatePatientDialog } from "@/features/patients/ui/create-patient-dialog";
import { DeletePatientDialog } from "@/features/patients/ui/delete-patient-dialog";
import { PatientDetailsDialog } from "@/features/patients/ui/patient-details-dialog";
import { PatientDoctorCombobox } from "@/features/patients/ui/patient-doctor-combobox";
import { PatientsDataTable } from "@/features/patients/ui/patients-data-table";
import {
  createPatientTableColumns,
  type PatientTableActions,
} from "@/features/patients/ui/patients-table-columns";
import { PatientsTableColumnMenu } from "@/features/patients/ui/patients-table-column-menu";
import { PatientVisitDateFilter } from "@/features/patients/ui/patient-visit-date-filter";
import { UpdatePatientDialog } from "@/features/patients/ui/update-patient-dialog";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { ClearFiltersButton } from "@/shared/ui/clear-filters-button";
import { DebouncedSearchInput } from "@/shared/ui/debounced-search-input";
import { Label } from "@/shared/ui/label";
import { PageHeader } from "@/shared/ui/page-header";
import { SearchableCombobox } from "@/shared/ui/searchable-combobox";
import { Skeleton } from "@/shared/ui/skeleton";

const PATIENT_SEARCH_DEBOUNCE_MS = 350;
const DOCTOR_ROSTER_PAGE_SIZE = 100;

export function PatientsDirectory() {
  const user = useSessionStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [debouncedSearch]);

  const queryParams = useMemo<ListPatientsParams>(() => {
    const params: ListPatientsParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    if (condition) {
      params.condition = condition;
    }
    if (isAdmin && doctorId) {
      params.doctorId = doctorId;
    }
    if (visitDate) {
      params.date = visitDate;
    }

    return params;
  }, [
    condition,
    debouncedSearch,
    doctorId,
    isAdmin,
    pagination.pageIndex,
    pagination.pageSize,
    visitDate,
  ]);

  const { data, isPending, isError, error } = useQuery(patientsQuery(queryParams));
  const {
    data: filterOptions,
    isPending: filterOptionsPending,
    isError: filterOptionsError,
  } = useQuery(patientFilterOptionsQuery());

  const {
    data: doctorRoster,
    isPending: doctorRosterPending,
    isError: doctorRosterError,
  } = useQuery({
    ...doctorsQuery({ limit: DOCTOR_ROSTER_PAGE_SIZE }),
    enabled: isAdmin,
  });

  const patients = data?.patients ?? [];
  const pageCount = data?.totalPages ?? 0;
  const doctors = useMemo(
    () => toDoctorRosterOptions(doctorRoster?.doctors ?? []),
    [doctorRoster?.doctors],
  );

  const doctorNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const doctor of doctors) {
      map.set(doctor.id, doctor.name);
    }
    return map;
  }, [doctors]);

  const filtersActive =
    search.trim().length > 0 ||
    condition.length > 0 ||
    doctorId.length > 0 ||
    visitDate.length > 0;

  const resetToFirstPage = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCondition("");
    setDoctorId("");
    setVisitDate("");
    resetToFirstPage();
  };

  const errorMessage =
    isError && error instanceof ApiRequestError ? error.message : undefined;

  const tableActions = useMemo<PatientTableActions>(
    () => ({
      onDetails: (patient) => {
        setSelectedPatient(patient);
        setDetailsOpen(true);
      },
      onUpdate: (patient) => {
        setSelectedPatient(patient);
        setUpdateOpen(true);
      },
      onDelete: (patient) => {
        setSelectedPatient(patient);
        setDeleteOpen(true);
      },
    }),
    [],
  );

  const tableColumns = useMemo(
    () =>
      createPatientTableColumns(tableActions, {
        doctorNameById,
        showDoctorColumn: isAdmin,
      }),
    [doctorNameById, isAdmin, tableActions],
  );

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  const selectedDoctorName = selectedPatient
    ? (doctorNameById.get(selectedPatient.doctorId) ??
      (user?.role === "doctor" && user.doctorId === selectedPatient.doctorId
        ? user.name
        : undefined))
    : undefined;

  return (
    <>
      <PageHeader
        title="Patients"
        description="View and manage patient records across the clinic."
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add patient
          </Button>
        }
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
            <div
              className={
                isAdmin
                  ? "grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-6"
                  : "grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
              }
            >
            <div className="flex min-w-0 flex-col gap-2 sm:col-span-2 xl:col-span-2">
              <Label htmlFor="patient-search">Search</Label>
              <div className="relative">
                <Search
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <DebouncedSearchInput
                  id="patient-search"
                  value={search}
                  onValueChange={setSearch}
                  onDebouncedChange={setDebouncedSearch}
                  debounceMs={PATIENT_SEARCH_DEBOUNCE_MS}
                  placeholder="Search by name"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="patient-condition-filter">Condition</Label>
              {filterOptionsPending ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <SearchableCombobox
                  id="patient-condition-filter"
                  value={condition}
                  onValueChange={(next) => {
                    setCondition(next);
                    resetToFirstPage();
                  }}
                  options={filterOptions?.conditions ?? []}
                  placeholder="All conditions"
                  searchPlaceholder="Search conditions..."
                  allLabel="All conditions"
                  disabled={filterOptionsError}
                />
              )}
            </div>

            {isAdmin ? (
              <div className="flex min-w-0 flex-col gap-2">
                <Label htmlFor="patient-doctor-filter">Doctor</Label>
                {doctorRosterPending ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <PatientDoctorCombobox
                    id="patient-doctor-filter"
                    value={doctorId}
                    onValueChange={(next) => {
                      setDoctorId(next);
                      resetToFirstPage();
                    }}
                    doctors={doctors}
                    allowClear
                    disabled={doctorRosterError}
                    placeholder="All doctors"
                    allLabel="All doctors"
                  />
                )}
              </div>
            ) : null}

            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="patient-date-filter">Visit date</Label>
              <PatientVisitDateFilter
                id="patient-date-filter"
                value={visitDate}
                onValueChange={(next) => {
                  setVisitDate(next);
                  resetToFirstPage();
                }}
                placeholder="All dates"
              />
            </div>

            <PatientsTableColumnMenu
              columns={tableColumns}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
            />
            </div>

            {filtersActive ? (
              <ClearFiltersButton
                className="self-end lg:self-auto"
                onClick={clearFilters}
              />
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          {errorMessage ? (
            <p className="text-destructive mb-4 text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <PatientsDataTable
            columns={tableColumns}
            data={patients}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            onRowClick={handleRowClick}
            isLoading={isPending}
            isError={isError}
          />
        </CardContent>
      </Card>

      <CreatePatientDialog open={createOpen} onOpenChange={setCreateOpen} doctors={doctors} />

      <PatientDetailsDialog
        patient={selectedPatient}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        doctorName={selectedDoctorName}
      />

      <UpdatePatientDialog
        patient={selectedPatient}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        doctors={doctors}
      />

      <DeletePatientDialog
        patient={selectedPatient}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}