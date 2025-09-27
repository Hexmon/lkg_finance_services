// src\app\(retailer)\bbps\bbps-online\[service_id]\page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Button, Dropdown } from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useBbpsCategoryListQuery } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";
import { useParams, useRouter } from "next/navigation";
import { useOnlineBillerListQuery, useOnlineBillProceedMutation, useRemoveOnlineBiller } from "@/features/retailer/retailer_bbps/bbps-online/multiple_bills";
import { useMessage } from "@/hooks/useMessage";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { ApiError } from "@/lib/api/client";
import PayModal from "@/components/bbps/BillDetails/PayModal";

const { Text } = Typography;

export default function ChooseServicePage() {
  type RouteParams = { service_id: string };
  const { service_id } = useParams<RouteParams>();
  const router = useRouter()
  const { success, error, warning } = useMessage()
  const { data, isLoading: isCatLoading, error: bbpsCatError } = useBbpsCategoryListQuery(
    { service_id, mode: "ONLINE" },
    { query: { enabled: Boolean(service_id) } }
  );
  const { data: catData } = data || {}

  const { removeBillerasync, isLoading: deleteBillerLoading, error: deleteBillerErr } = useRemoveOnlineBiller();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"Wallet" | "Cashfree">("Wallet");

  const onlineParams = useMemo(
    () => ({
      service_id,
      per_page: 10,
      page: 1,
      order: "desc" as const,
      sort_by: "created_at",
      status: "INITIATED",
      is_active: true,
      is_direct: false,
    }),
    [service_id]
  );

  const { data: ldata, isLoading: isBillersLoading, error: billersError } = useOnlineBillerListQuery({
    service_id,                       // make sure this exists
    per_page: 10,
    page: 1,
    order: "desc",
    sort_by: "created_at",
  });
  const billerLIst = ldata?.data ?? [];
  console.log({ ldata });

  const billers = (billerLIst ?? [])?.map(
    ({
      status,
      biller_batch_id,
      input_json: {
        amountInfo: { amount },
        customerInfo: { customerName, customerMobile } = {},
        billerResponse: { billAmount } = {},
      },
    }) => ({
      status,
      amount,
      biller_batch_id,
      customerName,
      customerMobile,
      billAmount,
    })
  ) ?? [];

  const totalAmount = billers.reduce(
    (sum, { amount }) => sum + Number(amount || 0),
    0
  );


  const {
    mutateAsync: proceed,
    data: proceedData,
    isPending: isProceeding,
    error: proceedError,
  } = useOnlineBillProceedMutation({
    onSuccess: (resp) => {
      success(resp?.message ?? "Request submitted successfully");
      // Optionally navigate / refetch online billers, etc.
      // router.push(`/bill_payment/bbps-online/confirmation/${service_id}`);
    },
    onError: (err) => {
      error(err.message || "Failed to proceed");
    },
  });

  const openPayModal = () => setIsPayModalOpen(true);
  const closePayModal = () => setIsPayModalOpen(false);

  const onProceedFromModal = async () => {
    // Choose which online batch to proceed.
    // Here we pick the *first* returned online biller and use its biller_batch_id as the batch_id payload.
    // If your API requires a different id, adjust mapping here.
    const firstOnline = billerLIst?.[0];
    const batchId = firstOnline?.batch_id;

    if (!batchId) {
      warning("No online biller found to proceed.");
      return;
    }
    if (!service_id) {
      error("Missing service_id");
      return;
    }

    try {
      await proceed({ service_id, batch_id: batchId });
      setIsPayModalOpen(false);
    } catch {
      // onError already handled by the mutation config
    }
  };

  const [searchText, setSearchText] = useState("");

  const filteredCategories = useMemo(() => {
    const list = catData ?? [];
    if (!searchText.trim()) return list;

    const q = searchText.toLowerCase();
    return list.filter((item) => {
      const name = (item?.biller_category ?? "").toLowerCase();
      const id = (item?.bbps_category_id ?? "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [catData, searchText]);

  const removeBiller = async (id: string) => {
    try {
      const res = await removeBillerasync({ biller_batch_id: id, service_id })
      if (res?.status === 200) {
        success(res?.message ?? "biller deleted successfully")
      }
    } catch (err) {
      if (err instanceof ApiError) {
        error(err.backendMessage ?? err.message ?? '');
      } else if (err instanceof DOMException && err.name === 'AbortError') {
        error('Request timed out');
      } else if (err instanceof Error) {
        error(err.message);
      } else {
        error('Something went wrong');
      }
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          className="px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white cursor-pointer"
          onClick={() => router.push("/bill_payment")}
        >
          Bill Payment
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white cursor-pointer"
          onClick={() => router.push("/bill_payment/raise-complaint")}
        >
          Raise Complaint
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white cursor-pointer"
          onClick={() => router.push("/bill_payment/transaction-status")}
        >
          Transaction Status
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout activePath="/bbps-online" sections={billPaymentSidebarConfig} isLoading={isBillersLoading && isCatLoading} pageTitle="Bill Payment">

      <div className="p-6 min-h-screen w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div
            className="flex items-center gap-2 text-gray-700 cursor-pointer"
            onClick={() => window.history.back()}
          >
            <DashboardSectionHeader
              title="Choose Service"
              titleClassName="text-[25px] font-medium "
              subtitle="Online Bill Payment"
              subtitleClassName="text-[15.5px] font-light text-[#1D1D1D]"

            />
          </div>

          <div className="flex items-center gap-4">
            <Dropdown menu={{ items }} placement="bottom" className="">
              <Button type="primary" className="!bg-white !text-black">View Transaction History</Button>
            </Dropdown>
            <Image src="/logo.svg" alt="logo" width={120} height={120} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center h-[61px] mb-6 bg-[#FFFFFF] rounded-xl shadow-sm px-4">
          {/* Icon */}
          <div className="text-[#D3C7B7] text-xl pr-3">
            <SearchOutlined />
          </div>

          <input
            type="text"
            placeholder="Search for bill payment services..."
            className="w-full border-none outline-none bg-transparent text-[#9A9595] placeholder-[#9A9595] text-[15px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Card className="!rounded-2xl !shadow-md !w-full !mb-6">
          <Text strong className="!block !mb-3 !text-[20px] !ml-8">Available Services</Text>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(filteredCategories ?? []).map((data) => {
              const { bbps_category_id, biller_category, icon } = data || {}
              return (
                <div
                  key={bbps_category_id}
                  onClick={() => {
                    router.push(
                      // `/bill_payment/bbps-online/${service_id}/bbps-broadband-postpaid/${bbps_category_id}/biller?label=${encodeURIComponent(
                      //   biller_category ?? ""
                      `/bill_payment/bbps-online/${service_id}/${biller_category}/${bbps_category_id}/biller`
                    );
                  }}
                >

                  {/* <div key={bbps_category_id} onClick={() => { router.push(`/bill_payment/bbps-online/${service_id}/bbps-customer-dtls/${bbps_category_id}`) }}> */}
                  <Card
                    className="cursor-pointer shadow rounded-md text-center py-2 bg-[#faf9f6] hover:border-blue-400 hover:shadow-md transition w-full h-[130px] text-[8px] break-words leading-tight"
                  >
                    <Image src={icon} alt={biller_category} height={50} width={50} className="text-center m-auto" />
                    <Text className="text-[8px]">{biller_category}</Text>
                  </Card>

                </div>
              )
            })}
          </div>
        </Card>

        {/* Manage Billers */}
        <Card className="rounded-2xl shadow-md w-full mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#5298FF54] w-[38px] h-[37px] rounded-[6px] flex items-center justify-center">
              <Image
                src="/mbill.svg"
                alt="Bill Phone"
                width={15}
                height={15}
              />
            </div>
            <Text strong className="!text-[20px]">Manage Billers</Text>
          </div>

          {Array.isArray(billers) && billers.length > 0 ? (
            <>
              {/* Billers List */}
              <div className="flex flex-col gap-4">
                {billers.map(
                  ({ billAmount, customerName, biller_batch_id }) => {
                    return (
                      <div
                        key={biller_batch_id}
                        className="flex justify-between items-center bg-white rounded-xl px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <Text strong>{customerName ?? "Unknown"}</Text>
                            <div className="text-xs text-gray-500">
                              {biller_batch_id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Text strong>₹{billAmount ?? 0}</Text>
                          <Button
                            type="text"
                            onClick={() => removeBiller(biller_batch_id)}
                            icon={<DeleteOutlined className="!text-red-500" />}
                          />

                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Total Section */}
              <div className="flex justify-between items-center mt-4 px-2 mb-5">
                <Text strong className="!text-[20px] !font-medium">
                  Total Amount
                </Text>
                <Text strong>₹{totalAmount}.00</Text>
              </div>

              <Button
                type="primary"
                block
                className="!bg-[#3386FF] !border-[#3386FF] !text-white !rounded-xl !py-5 !text-[12px] !shadow-md !w-full !h-[39px]"
                disabled={isProceeding}
                loading={isProceeding}
                onClick={openPayModal}
              >
                Proceed to Pay
              </Button>


              {/* Error Message */}
              {proceedError && (
                <div className="mt-3 text-red-500 text-sm">
                  {(proceedError as Error)?.message || "Failed to proceed"}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-6">
              No billers available
            </div>
          )}

        </Card>
      </div>
      <PayModal
        open={isPayModalOpen}
        onClose={closePayModal}
        payLoading={isProceeding}
        ctaAmountText={Number(totalAmount || 0).toFixed(2)}  // already formatted ₹ in the modal
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        onProceed={onProceedFromModal}

        /* per your note: keep UI the same but don't use adhoc or amount inputs */
        billerAdhoc={false}
        paymentAmount={null}
        setPaymentAmount={() => { }}
      />

    </DashboardLayout>
  );
}