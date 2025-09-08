/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { Card, Typography, Button } from "antd";
import { CardLayout } from "@/lib/layouts/CardLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DashboardDetailsResponse, DEFAULT_DASHBOARD, useRetailerDashboardQuery } from "@/features/retailer/general";
import { CaretUpOutlined } from "@ant-design/icons";
import Profile from "@/components/dashboard/Profile";
import Feature from "@/components/dashboard/Feature";
import Services from "@/components/dashboard/Services";

const { Title, Text } = Typography;

export default function Dashboard() {
  const router = useRouter();
  const { data, isLoading } = useRetailerDashboardQuery();

  // 1) Coalesce once
  const dashboard: DashboardDetailsResponse = data ?? DEFAULT_DASHBOARD;

  // 2) Destructure from the guaranteed object
  const {
    quick_links,
    name: rawName,
    balances,
    commissions,
    // profile,
    transactions: apiTransactions,
    // user_id,
    username,
    virtual_account,
  } = dashboard;

  const totalBalance = (balances?.MAIN ?? "") + (balances?.AEPS ?? "")

  const {
    success_rate = 0,
    success_rate_ratio = 0,
    // growth = 0,
    total_transaction: {
      total_count: totalTxnCount = 0,
      ratio: totalTxnRatio = 0,
      // growth: totalTxnGrowth = 0,
    } = {},
    // overall_transaction: {
    //   total_count: overallTxnCount = 0,
    //   ratio: overallTxnRatio = 0,
    //   growth: overallTxnGrowth = 0,
    // } = {},
  } = apiTransactions || {};
console.log({quick_links});

  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/"
      pageTitle="Dashboards"
      isLoading={isLoading}
    >
      <Profile totalBalance={totalBalance} username={rawName || username} virtual_account={virtual_account} />

      <Feature commissions={commissions} success_rate={success_rate} success_rate_ratio={success_rate_ratio} totalTxnCount={totalTxnCount} totalTxnRatio={totalTxnRatio} />

      {/* Quick Services */}
      <Services quick_link={quick_links} />

      {/* Wallet Overview & Recent Activity */}
      <div className="flex flex-col md:flex-row gap-6 mt-4 w-full">
        <Card className="!rounded-2xl !shadow-sm !w-full !mb-10">
          <div className="flex justify-between items-start w-full mb-4">
            <div>
              <Text strong className="block !font-semibold !text-[20px] mb-0">Wallet Overview</Text>
              <Text className="!font-light !text-sm !text-[13px]">Manage Your Financial Account</Text>
            </div>

            <div className="w-[111px] h-[29px] flex items-center cursor-pointer shadow-[0px_4px_8.9px_rgba(0,0,0,0.1)] rounded-[9px] justify-center">
              <Image src="/upload.svg" alt="eye icon" width={15} height={15} />
              <Text className="!font-normal !text-[10px] ml-2 mt-[2px]">View All</Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CardLayout
              className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
              header={
                <div className="flex justify-between items-start w-full">
                  <div className="bg-blue-500 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <Image src="/icons/cashfree-payment.svg" alt="" width={35} height={35} />
                  </div>
                  <Image src="/icons/cashfree-payment.svg" alt="growth" width={30} height={13} className="mt-3" />
                </div>
              }
              body={
                <div>
                  <p className="text-[24px] font-bold text-black mt-2">₹ {balances.MAIN}</p>
                  <p className="text-gray-500 text-[14px] font-medium mt-1">Main Wallet</p>
                </div>
              }
            />
            <CardLayout
              className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
              header={
                <div className="flex justify-between items-start w-full">
                  <div className="bg-blue-500 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                    {/* <Image src={wallet.icon} alt={wallet.label} width={35} height={35} /> */}
                  </div>
                  {/* <Image src={wallet.growthIcon} alt="growth" width={30} height={13} className="mt-3" /> */}
                </div>
              }
              body={
                <div>
                  <p className="text-[24px] font-bold text-black mt-2">₹ {balances.AEPS}</p>
                  <p className="text-gray-500 text-[14px] font-medium mt-1">APES Wallet</p>
                </div>
              }
            />
            <CardLayout
              className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
              header={
                <div className="flex justify-between items-start w-full">
                  <div className="bg-blue-500 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                    {/* <Image src={wallet.icon} alt={wallet.label} width={35} height={35} /> */}
                  </div>
                  {/* <Image src={wallet.growthIcon} alt="growth" width={30} height={13} className="mt-3" /> */}
                </div>
              }
              body={
                <div>
                  <p className="text-[24px] font-bold text-black mt-2">₹ {commissions.overall}</p>
                  <p className="text-gray-500 text-[14px] font-medium mt-1">Commission</p>
                </div>
              }
            />
          </div>
        </Card>

        <CardLayout
          className="!rounded-2xl !shadow-sm !w-full !mb-10"
          body={
            <div>
              <div className="flex justify-between items-start w-full mb-4">
                <div>
                  <Text strong className="block !font-semibold !text-[20px] mb-0">Recent Activity</Text>
                  <Text className="!font-light !text-sm !text-[13px]">Manage Your Financial Account</Text>
                </div>

                <div className="w-[111px] h-[29px] flex items-center cursor-pointer shadow-[0px_4px_8.9px_rgba(0,0,0,0.1)] rounded-[9px] justify-center">
                  <Image src="/eye.svg" alt="eye icon" width={15} height={15} />
                  <Text className="!font-normal !text-[10px] ml-2 mt-[2px]">View All</Text>
                </div>
              </div>

              {/* <div className="flex flex-col gap-3">
                {recentTx.map((tx, idx) => {
                  const amount =
                    typeof tx?.amount === "number" && Number.isFinite(tx.amount)
                      ? tx.amount
                      : Number.NaN;

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-[#FFFFFF] rounded-xl px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-3 rounded-full flex items-center justify-center w-[55px] h-[55px]">
                          <Image src="/heart-line.svg" alt="heart line" width={26} height={30} />
                        </div>

                        <div>
                          <Text strong className="block">{tx?.type ?? "—"}</Text>
                          <div className="text-sm text-gray-500">{tx?.name ?? "—"}</div>
                          <div className="text-[10px] text-gray-400">{tx?.time ?? ""}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-[6px]">
                        <Text strong className="text-[#000000]">
                          {Number.isFinite(amount) ? `₹${amount.toLocaleString()}` : "—"}
                        </Text>

                        <div
                          className={`text-[5px] px-2 py-[2px] rounded-full font-medium capitalize w-[35px] h-[11px]
                            ${
                              tx?.status === "success"
                                ? "bg-[#0BA82F36] text-[#0BA82F]"
                                : tx?.status === "failed"
                                ? "bg-[#F9071854] text-[#FA0004]"
                                : tx?.status === "processing"
                                ? "bg-[#FFC10769] text-[#FFC107]"
                                : "bg-[#EEEEEE] text-[#666666]"
                            }`}
                        >
                          {tx?.status ?? "—"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div> */}
            </div>
          }
        />
      </div>

      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}
