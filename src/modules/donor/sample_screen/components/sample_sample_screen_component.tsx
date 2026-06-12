"use client";

import { memo, useMemo, useState, useEffect, useRef } from "react";
import { Chip } from "@heroui/chip";
import {
  Plus,
  Edit,
  ChevronDown,
  Filter as FilterIcon,
  Archive,
} from "lucide-react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { getSampleScreenOutputModel } from "../api/get_sample_screen/get_sample_screen_store";
import { sampleSampleScreenInputModel } from "../store/sample_sample_screen_store";
import { sampleNewSampleScreenInputModel } from "../../new_sample_screen/store/sample_new_sample_screen_store";
import {
  callDeleteSampleScreenApi,
  callGetSampleScreenApi,
} from "../controller/sample_sample_screen_controller";

import { navigate } from "@/core/navigation/simplified_router";
import { ButtonAppi } from "@/components/appikorn-components/button_appi/button_appi";
import {
  TableAppi,
  TableColumn,
  TableRowData,
} from "@/components/appikorn-components/table/table_appi";
import ConfirmationModal, {
  ConfirmationModalRef,
} from "@/components/global-components/confirmation-modal";

export const SampleScreenTableField = memo(() => {
  const rawData = getSampleScreenOutputModel.useSelector(
    (state) => state.getSampleScreenData?.data?.Get_SampleScreen?.items || [],
  );

  const totalItems = getSampleScreenOutputModel.useSelector(
    (state) => state.getSampleScreenData?.data?.Get_SampleScreen?.pageInfo?.totalItems || 0,
  );

  const isLoading = getSampleScreenOutputModel.useSelector(
    (state) => state.getSampleScreenData?.loading || false,
  );

  const pageNo = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.pageNo || 1,
  );

  const pageSize = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.pageSize || 10,
  );

  const selectedStatus = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.status || "",
  );

  const selectedCategory = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.category || "",
  );

  const search = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.search || "",
  );

  const categoriesList = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.categoriesList || [],
  );

  const statusesList = sampleSampleScreenInputModel.useSelector(
    (state) => state.sampleSampleScreenData?.statusesList || [],
  );

  const categoriesOptions = useMemo(() => {
    return categoriesList.map((item: any) => ({
      label: item.DESC || "",
      value: item.CODE || "",
    }));
  }, [categoriesList]);

  const statusesOptions = useMemo(() => {
    return statusesList
      .filter((item: any) => (item.DESC || "").toUpperCase() !== "NONE")
      .map((item: any) => ({
        label: item.DESC || "",
        value: item.CODE || "",
      }));
  }, [statusesList]);

  const [visibleFilters, setVisibleFilters] = useState<Set<string>>(() => {
    const active = new Set<string>();
    if (selectedCategory) active.add("CATEGORY");
    if (selectedStatus) active.add("STATUS");
    return active;
  });

  useEffect(() => {
    setVisibleFilters((prev) => {
      const next = new Set(prev);
      let changed = false;

      if (selectedCategory && !next.has("CATEGORY")) {
        next.add("CATEGORY");
        changed = true;
      }
      if (selectedStatus && !next.has("STATUS")) {
        next.add("STATUS");
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [selectedCategory, selectedStatus]);

  const filterByButton = useMemo(() => {
    const options = [
      { key: "CATEGORY", label: "Category" },
      { key: "STATUS", label: "Status" },
    ].filter((opt) => !visibleFilters.has(opt.key));

    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="h-[36px] sm:h-[40px] px-2.5 sm:px-3 border border-gray-200 dark:border-gray-700 min-w-0 bg-transparent rounded-md"
            endContent={<ChevronDown className="opacity-50" size={14} />}
            startContent={<FilterIcon size={14} />}
            variant="bordered"
          >
            <span className="text-[11px] sm:text-xs font-semibold">
              Filter By
            </span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Add Filter Options"
          onAction={(key) => {
            const filterKey = key as string;
            setVisibleFilters((prev) => {
              const next = new Set(prev);
              next.add(filterKey);
              return next;
            });
          }}
        >
          {options.length > 0 ? (
            options.map((opt) => (
              <DropdownItem key={opt.key} className="text-xs">
                {opt.label}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem key="none" isDisabled className="text-xs text-slate-400">
              All filters active
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }, [visibleFilters]);

  const filterConfigs = useMemo(() => {
    const configs = [];

    if (visibleFilters.has("STATUS")) {
      configs.push({
        uid: "STATUS",
        label: "Status",
        placeholder: "All Statuses",
        options: statusesOptions,
        value: selectedStatus ? new Set([selectedStatus]) : new Set([]),
        onChange: (val: any) => {
          const status = val === "all" ? "" : (Array.from(val)[0] as string) || "";
          callGetSampleScreenApi({ pageNo: 1, status });
          if (!status) {
            setVisibleFilters((prev) => {
              const next = new Set(prev);
              next.delete("STATUS");
              return next;
            });
          }
        },
      });
    }

    if (visibleFilters.has("CATEGORY")) {
      configs.push({
        uid: "CATEGORY",
        label: "Category",
        placeholder: "All Categories",
        options: categoriesOptions,
        value: selectedCategory ? new Set([selectedCategory]) : new Set([]),
        onChange: (val: any) => {
          const category = val === "all" ? "" : (Array.from(val)[0] as string) || "";
          callGetSampleScreenApi({ pageNo: 1, category });
          if (!category) {
            setVisibleFilters((prev) => {
              const next = new Set(prev);
              next.delete("CATEGORY");
              return next;
            });
          }
        },
      });
    }

    return configs;
  }, [selectedStatus, selectedCategory, statusesOptions, categoriesOptions, visibleFilters]);

  const rows: TableRowData[] = useMemo(() => {
    return rawData.map((item: any) => {
      return {
        id: item._id,
        SAMPLE_SCREEN_CODE: item.SAMPLE_SCREEN_CODE,
        CATEGORY: (item.CATEGORY_DETAILS?.DESC as string) || item.CATEGORY || "",
        DESCRIPTION: item.DESCRIPTION,
        TOTAL: item.TOTAL,
        STATUS: (item.STATUS_DETAILS?.DESC as string) || item.STATUS || "-",
        _fullData: item,
      };
    });
  }, [rawData]);

  const handleEditSampleScreen = (sample_screen: any) => {
    sampleNewSampleScreenInputModel.update({
      sampleNewSampleScreenData: {
        total: String(sample_screen.TOTAL || 0),
        category: sample_screen.CATEGORY_DETAILS?.CODE || sample_screen.CATEGORY || "",
        description: sample_screen.DESCRIPTION || "",
        sampleScreenCode: sample_screen.SAMPLE_SCREEN_CODE || "",
        isEdit: true,
        status: sample_screen.STATUS || "001",
      },
    });

    navigate("/features/finance/new_sample_screen");
  };

  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleConfirmArchive = async (sample_screen: any) => {
    setIsArchiving(true);
    await callDeleteSampleScreenApi(sample_screen.SAMPLE_SCREEN_CODE);
    setIsArchiving(false);
  };

  const columns: TableColumn[] = useMemo(() => {
    return [
      {
        name: "Code",
        uid: "SAMPLE_SCREEN_CODE",
        renderCell: (value: any) => (
          <Chip
            className="text-[10px] bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 font-semibold"
            size="sm"
            variant="flat"
          >
            {value || "N/A"}
          </Chip>
        ),
      },
      {
        name: "Category",
        uid: "CATEGORY",
        renderCell: (value: any) => (
          <span className="text-xs text-slate-500 font-medium">
            {value || "-"}
          </span>
        ),
      },
      {
        name: "Description",
        uid: "DESCRIPTION",
        renderCell: (value: any) => (
          <p className="font-medium text-slate-900 dark:text-white text-xs">
            {value || "No Description"}
          </p>
        ),
      },
      {
        name: "Amount",
        uid: "TOTAL",
        renderCell: (value: any) => (
          <span className="font-semibold text-xs text-emerald-600">
            {value ? Number(value).toLocaleString() : "-"}
          </span>
        ),
      },
      {
        name: "Status",
        uid: "STATUS",
        renderCell: (value: any) => {
          let color: "default" | "success" | "warning" | "danger" = "default";
          const statusVal = String(value).toUpperCase();

          if (statusVal === "APPROVED" || statusVal === "002") color = "success";
          if (statusVal === "PENDING" || statusVal === "001") color = "warning";
          if (statusVal === "REJECTED" || statusVal === "003") color = "danger";

          return (
            <Chip
              className="text-[9px] h-5 font-bold uppercase"
              color={color}
              size="sm"
              variant="flat"
            >
              {value}
            </Chip>
          );
        },
      },
      {
        name: "Actions",
        uid: "actions",
        renderCell: (value: any, rowIndex: number) => {
          const row = rows[rowIndex];

          return (
            <div className="flex justify-center gap-1">
              <Button
                isIconOnly
                className="hover:bg-primary/10 transition-all duration-200 hover:scale-110 rounded-full"
                color="primary"
                size="sm"
                title="Edit SampleScreen"
                variant="light"
                onPress={() => handleEditSampleScreen(row._fullData)}
              >
                <Edit size={16} />
              </Button>
              <Button
                isIconOnly
                className="hover:bg-danger/10 text-danger transition-all duration-200 hover:scale-110 rounded-full"
                color="danger"
                size="sm"
                title="Archive"
                variant="light"
                onPress={() => {
                  confirmationModalRef.current?.open(row);
                }}
              >
                <Archive size={16} />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [rows]);

  return (
    <>
      <div className="flex-1 h-full min-h-0 w-full flex flex-col overflow-hidden p-3 sm:p-4 lg:p-5">
        <TableAppi
          ariaLabel="List table"
          bottomContentLabel="items"
          columns={columns}
          currentPage={pageNo}
          customStartContent={filterByButton}
          filterConfigs={filterConfigs}
          initialSearchValue={search}
          isFilterable={true}
          isLoading={isLoading}
          isPaginated={true}
          rows={rows}
          rowsPerPage={pageSize}
          searchColumnUid="DESCRIPTION"
          showColumnVisibility={true}
          showSearchMenu={false}
          totalLength={totalItems}
          onPageChange={(page) => callGetSampleScreenApi({ pageNo: page })}
          onRowsPerPageChange={(size) => callGetSampleScreenApi({ pageNo: 1, pageSize: size })}
          onSearch={(value) => {
            callGetSampleScreenApi({ pageNo: 1, search: value, pageSize });
          }}
        />
      </div>

      <ConfirmationModal
        ref={confirmationModalRef}
        confirmText="Archive"
        description={(item) =>
          `Are you sure you want to archive "${item?.SAMPLE_SCREEN_CODE || "this item"}"? This action cannot be undone.`
        }
        isLoading={isArchiving}
        level="warning"
        title="Archive Record"
        onConfirm={handleConfirmArchive}
      />
    </>
  );
});
SampleScreenTableField.displayName = "SampleScreenTableField";

export const NewSampleScreenField = memo(() => {
  return (
    <ButtonAppi
      className="font-semibold shadow-md dark:shadow-primary/20"
      color="primary"
      size="md"
      startContent={<Plus size={16} strokeWidth={2.5} />}
      variant="solid"
      onClick={() => {
        sampleNewSampleScreenInputModel.reset();
        navigate("/features/finance/new_sample_screen");
      }}
    >
      Create New
    </ButtonAppi>
  );
});
NewSampleScreenField.displayName = "NewSampleScreenField";
