"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState, VisibilityState } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useSessionReady } from "@/features/auth/lib/use-session-ready";
import { useSessionStore } from "@/features/auth/model/session-store";
import type { ListDoctorsParams } from "@/features/doctors/model/types";
import { doctorFilterOptionsQuery, doctorsQuery } from "@/features/doctors/queries/doctors";
import type { DoctorWithUser } from "@/features/doctors/model/types";
import { CreateDoctorDialog } from "@/features/doctors/ui/create-doctor-dialog";
import { DeleteDoctorDialog } from "@/features/doctors/ui/delete-doctor-dialog";
import { DoctorDetailsDialog } from "@/features/doctors/ui/doctor-details-dialog";
import { DoctorPatientsDialog } from "@/features/doctors/ui/doctor-patients-dialog";
import { DoctorsDataTable } from "@/features/doctors/ui/doctors-data-table";
import {
  createDoctorTableColumns,
  type DoctorTableActions,
} from "@/features/doctors/ui/doctors-table-columns";
import { UpdateDoctorDialog } from "@/features/doctors/ui/update-doctor-dialog";
import { DoctorsTableColumnMenu } from "@/features/doctors/ui/doctors-table-column-menu";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { ClearFiltersButton } from "@/shared/ui/clear-filters-button";
import { DebouncedSearchInput } from "@/shared/ui/debounced-search-input";
import { Label } from "@/shared/ui/label";
import { PageHeader } from "@/shared/ui/page-header";
import { PatientVisitDateFilter } from "@/features/patients/ui/patient-visit-date-filter";
import { SearchableCombobox } from "@/shared/ui/searchable-combobox";
import { Skeleton } from "@/shared/ui/skeleton";

const DOCTOR_SEARCH_DEBOUNCE_MS = 350;

export function DoctorsDirectory() {
  const sessionReady = useSessionReady();
  const isAdmin = useSessionStore((state) => state.user?.role === "admin");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [patientsOpen, setPatientsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [debouncedSearch, createdFrom, createdTo, specialization, hospital]);

  const queryParams = useMemo<ListDoctorsParams>(() => {
    const params: ListDoctorsParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    if (specialization) {
      params.specialization = specialization;
    }
    if (hospital) {
      params.hospital = hospital;
    }
    if (createdFrom) {
      params.createdFrom = createdFrom;
    }
    if (createdTo) {
      params.createdTo = createdTo;
    }

    return params;
  }, [
    createdFrom,
    createdTo,
    debouncedSearch,
    hospital,
    pagination.pageIndex,
    pagination.pageSize,
    specialization,
  ]);

  const { data, isPending, isError, error } = useQuery({
    ...doctorsQuery(queryParams),
    enabled: sessionReady && isAdmin,
  });
  const {
    data: filterOptions,
    isPending: filterOptionsPending,
    isError: filterOptionsError,
  } = useQuery({
    ...doctorFilterOptionsQuery(),
    enabled: sessionReady && isAdmin,
  });

  const doctors = data?.doctors ?? [];
  const pageCount = data?.totalPages ?? 0;

  const filtersActive =
    search.trim().length > 0 ||
    specialization.length > 0 ||
    hospital.length > 0 ||
    createdFrom.length > 0 ||
    createdTo.length > 0;

  const resetToFirstPage = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSpecialization("");
    setHospital("");
    setCreatedFrom("");
    setCreatedTo("");
    resetToFirstPage();
  };

  const errorMessage =
    isError && error instanceof ApiRequestError ? error.message : undefined;

  const tableActions = useMemo<DoctorTableActions>(
    () => ({
      onDetails: (doctor) => {
        setSelectedDoctor(doctor);
        setDetailsOpen(true);
      },
      onPatients: (doctor) => {
        setSelectedDoctor(doctor);
        setPatientsOpen(true);
      },
      onUpdate: (doctor) => {
        setSelectedDoctor(doctor);
        setUpdateOpen(true);
      },
      onDelete: (doctor) => {
        setSelectedDoctor(doctor);
        setDeleteOpen(true);
      },
    }),
    [],
  );

  const tableColumns = useMemo(
    () => createDoctorTableColumns(tableActions),
    [tableActions],
  );

  const handleRowClick = (doctor: DoctorWithUser) => {
    setSelectedDoctor(doctor);
    setDetailsOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Browse and manage doctors on the clinic roster."
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add doctor
          </Button>
        }
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-7">
            <div className="flex min-w-0 flex-col gap-2 sm:col-span-2 xl:col-span-2">
              <Label htmlFor="doctor-search">Search</Label>
              <div className="relative">
                <Search
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <DebouncedSearchInput
                  id="doctor-search"
                  value={search}
                  onValueChange={setSearch}
                  onDebouncedChange={setDebouncedSearch}
                  debounceMs={DOCTOR_SEARCH_DEBOUNCE_MS}
                  placeholder="Search by name, email, or phone"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor-specialization-filter">Specialization</Label>
              {filterOptionsPending ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <SearchableCombobox
                  id="doctor-specialization-filter"
                  value={specialization}
                  onValueChange={(next) => {
                    setSpecialization(next);
                    resetToFirstPage();
                  }}
                  options={filterOptions?.specializations ?? []}
                  placeholder="All specializations"
                  searchPlaceholder="Search specializations..."
                  allLabel="All specializations"
                  disabled={filterOptionsError}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor-hospital-filter">Hospital</Label>
              {filterOptionsPending ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <SearchableCombobox
                  id="doctor-hospital-filter"
                  value={hospital}
                  onValueChange={(next) => {
                    setHospital(next);
                    resetToFirstPage();
                  }}
                  options={filterOptions?.hospitals ?? []}
                  placeholder="All hospitals"
                  searchPlaceholder="Search hospitals..."
                  allLabel="All hospitals"
                  disabled={filterOptionsError}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor-created-from">Added from</Label>
              <PatientVisitDateFilter
                id="doctor-created-from"
                value={createdFrom}
                placeholder="No start date"
                onValueChange={(next) => {
                  setCreatedFrom(next);
                  resetToFirstPage();
                }}
                clearLabel="No start date"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor-created-to">Added to</Label>
              <PatientVisitDateFilter
                id="doctor-created-to"
                value={createdTo}
                placeholder="No end date"
                onValueChange={(next) => {
                  setCreatedTo(next);
                  resetToFirstPage();
                }}
                clearLabel="No end date"
              />
            </div>

            <DoctorsTableColumnMenu
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
          <DoctorsDataTable
            columns={tableColumns}
            data={doctors}
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

      <CreateDoctorDialog open={createOpen} onOpenChange={setCreateOpen} />

      <DoctorDetailsDialog
        doctor={selectedDoctor}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <DoctorPatientsDialog
        doctor={selectedDoctor}
        open={patientsOpen}
        onOpenChange={setPatientsOpen}
      />

      <UpdateDoctorDialog
        doctor={selectedDoctor}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />

      <DeleteDoctorDialog
        doctor={selectedDoctor}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}