"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Select, Input, Button } from "antd";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { useBbpsBillerListQuery } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";
import { useParams, useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function BroadbandPrepaidPage() {
  const router = useRouter();
  const { service_id, bbps_category_id } = useParams() as {
    service_id: string;
    bbps_category_id: string;
  };

  // Single state store for all dynamic inputs (keyed by param_name)
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [biller, setBiller] = useState<string | undefined>();

  const {
    data: {
      data: [
        {
          inputParams = [],
          biller_name,
          biller_status,
          planMdmRequirement,
          biller_fetch_requiremet
        } = {},
      ] = [],
    } = {},
    isLoading,
    isError,
    error,
  } = useBbpsBillerListQuery({
    service_id,
    bbps_category_id,
    is_offline: false,
    mode: "ONLINE",
  });

  // Default the biller dropdown to the fetched biller_name (once)
  React.useEffect(() => {
    if (biller_name && !biller) {
      setBiller(biller_name);
    }
  }, [biller_name, biller]);

  // Basic validation helper using provided regex (if any)
  const isParamValid = (paramName: string, value: string, pattern?: string) => {
    if (!pattern) return true;
    try {
      const re = new RegExp(pattern);
      return re.test(value ?? "");
    } catch {
      // If pattern is invalid, don't block the user
      return true;
    }
  };

  const canSubmit = useMemo(() => {
    if (!biller || !biller_status) return false; // add biller_status condition
    for (const p of inputParams) {
      const val = formValues[p.param_name] ?? "";
      if (!p.is_optional && !val) return false;
      if (val && !isParamValid(p.param_name, val, p.regex_pattern ?? undefined)) {
        return false;
      }
      if (p.min_length != null && val.length < p.min_length) return false;
      if (p.max_length != null && val.length > p.max_length) return false;
    }
    return true;
  }, [biller, inputParams, formValues, biller_status]);


  // Map BBPS data_type codes into readable labels
  const formatDataType = (type?: string) => {
    switch (type) {
      case "NUMERIC":
        return "Numbers only";
      case "ALPHABET":
        return "Alphabets only";
      case "ALPHANUMERIC":
        return "Letters and numbers";
      case "DATE":
        return "Date format";
      default:
        return type || "";
    }
  };

  // Turn regex into simpler wording (basic example)
  const formatRegex = (regex?: string) => {
    if (!regex) return "";
    if (regex === "^[0-9]{10}$") return "Must be exactly 10 digits";
    if (regex.includes("[a-zA-Z0-9]")) return "Up to 30 letters or numbers";
    return `Pattern: ${regex}`;
  };


  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError && (typeof error === "object" && error && "data" in (error as any))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (error as any)?.data?.error?.message ?? "Failed to load biller details."
      : isError
        ? "Failed to load biller details."
        : undefined;

  return (
    <DashboardLayout
      activePath="/bill_payment"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Payment"
      isLoading={isLoading}
    >
      <div className="min-h-screen w-full mb-3">
        <div className="flex justify-between items-center">
          <DashboardSectionHeader
            title="Broadband Postpaid"
            titleClassName="!font-medium text-[20px] !mt-0"
            subtitle="Recharge"
            subtitleClassName="!mb-4"
            showBack
          />
          <Image
            src="/logo.svg"
            alt="logo"
            width={100}
            height={100}
            className="p-1"
          />
        </div>

        <Card className="rounded-2xl shadow-md w-full">
          {/* Section Title */}
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/wifi.svg"
              alt="wifi"
              width={21}
              height={21}
              className="object-contain"
            />
            <Title level={5} className="!mb-0">
              Select Broadband Biller
            </Title>
          </div>

          {/* Error (if any) */}
          {errorMessage && (
            <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4 ml-6">
            {/* Biller Dropdown */}
            <div>
              <Text strong className="!mb-4">
                Biller *
              </Text>
              <Select
                placeholder="Choose Your Biller"
                value={biller}
                onChange={setBiller}
                className="!w-full !mt-1 !h-[54px]"
                options={
                  biller_name
                    ? [{ label: biller_name, value: biller_name }]
                    : []
                }
              />
            </div>

            {/* Dynamic Input Fields based on inputParams */}
            {inputParams?.map((param, idx) => {
              const val = formValues[param.param_name] ?? "";
              const showRegexError =
                !!val &&
                !!param.regex_pattern &&
                !isParamValid(param.param_name, val, param.regex_pattern);
              const showMinLenError =
                !!val && param.min_length != null && val.length < param.min_length;
              const showMaxLenError =
                !!val && param.max_length != null && val.length > param.max_length;

              return (
                <div key={idx}>
                  <Text strong>
                    {param.display_name} {param.is_optional ? "" : "*"}
                  </Text>
                  <Input
                    placeholder={`Enter ${param.display_name}`}
                    value={val}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [param.param_name]: e.target.value,
                      }))
                    }
                    className="mt-1 !h-[54px]"
                    maxLength={param.max_length ?? undefined}
                    // Note: Input doesn't enforce minLength visually; we use messages below.
                    required={!param.is_optional}
                  />
                  {(showRegexError || showMinLenError || showMaxLenError) && (
                    <div className="text-xs text-red-600 mt-1">
                      {!showRegexError ? null : "Invalid format."}
                      {!showMinLenError ? null : (
                        <>
                          {" "}
                          Minimum length is {param.min_length}.
                        </>
                      )}
                      {!showMaxLenError ? null : (
                        <>
                          {" "}
                          Maximum length is {param.max_length}.
                        </>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1 mb-6">
                    {param.data_type && <span>{formatDataType(param.data_type)}</span>}
                    {param.regex_pattern && (
                      <span> • {formatRegex(param.regex_pattern)}</span>
                    )}
                    {param.min_length != null && param.max_length != null && (
                      <span> • Length: {param.min_length}–{param.max_length} characters</span>
                    )}
                  </div>

                </div>
              );
            })}

            <Button
              type="primary"
              block
              disabled={!canSubmit}
              loading={isLoading}
              className={`!h-[45px] !rounded-[12px] !text-white ${canSubmit ? "!bg-[#3386FF]" : "!bg-[#3386FF] !cursor-not-allowed !opacity-60"
                }`}
              onClick={() => {
                router.push(
                  `/bill_payment/bbps-online/${service_id}/bbps-broadband-postpaid/${bbps_category_id}`
                );
              }}
            >
              Fetch Bill Details
            </Button>

          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
