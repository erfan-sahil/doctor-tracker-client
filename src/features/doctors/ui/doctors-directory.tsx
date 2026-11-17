"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState, VisibilityState } from "@tanstack/react-table";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { ListDoctorsParams } from "@/features/doctors/model/types";
import { doctorFilterOptionsQuery, doctorsQuery } from "@/features/doctors/queries/doctors";
import type { DoctorWithUser } from "@/features/doctors/model/types";
import { CreateDoctorDialog } from "@/features/doctors/ui/create-doctor-dialog";
import { DeleteDoctorDialog } from "@/features/doctors/ui/delete-doctor-dialog";
import { DoctorDetailsDialog } from "@/features/doctors/ui/doctor-details-dialog";
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
import { DebouncedSearchInput } from "@/shared/ui/debounced-search-input";
import { Label } from "@/shared/ui/label";
import { PageHeader } from "@/shared/ui/page-header";
import { SearchableCombobox } from "@/shared/ui/searchable-combobox";
import { Skeleton } from "@/shared/ui/skeleton";

const DOCTOR_SEARCH_DEBOUNCE_MS = 350;

export function DoctorsDirectory() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
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

    return params;
  }, [
    debouncedSearch,
    hospital,
    pagination.pageIndex,
    pagination.pageSize,
    specialization,
  ]);

  const { data, isPending, isError, error } = useQuery(doctorsQuery(queryParams));
  const {
    data: filterOptions,
    isPending: filterOptionsPending,
    isError: filterOptionsError,
  } = useQuery(doctorFilterOptionsQuery());

  const doctors = data?.doctors ?? [];
  const pageCount = data?.totalPages ?? 0;

  const filtersActive =
    search.trim().length > 0 || specialization.length > 0 || hospital.length > 0;

  const resetToFirstPage = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSpecialization("");
    setHospital("");
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="flex flex-col gap-2 sm:col-span-2 xl:col-span-2">
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
                  placeholder="Search by name or email"
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

            <DoctorsTableColumnMenu
              columns={tableColumns}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
            />
          </div>

          {filtersActive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={clearFilters}
            >
              <X className="size-4" aria-hidden="true" />
              Clear filters
            </Button>
          ) : null}
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