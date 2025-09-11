"use client";

import React from "react";
import { Card, Typography } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

const plans = [
  {
    id: 1,
    category: "Special Offer",
    talktime: "0",
    validity: "30",
    description: "Vas Package including SMS, WAP, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    id: 2,
    category: "Top up",
    talktime: "0",
    validity: "30",
    description: "Vas Package including SMS, WAP, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    id: 3,
    category: "Full Talktime",
    talktime: "0",
    validity: "30",
    description: "Vas Package including SMS, WAP, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    id: 4,
    category: "Rate Cutter",
    talktime: "0",
    validity: "30",
    description: "Vas Package including SMS, WAP, Validity extension cannot be done with this STV",
    price: "₹799",
  },
];

export default function FastTagRechargePlansPage() {
  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/fastag/onboarding"
      pageTitle="FASTag"
    >
      <DashboardSectionHeader
        title="FASTag Recharge"
        subtitle="Electronic Toll Collection"
        titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
        arrowClassName="!text-[#2F2F2F]"
        imgSrc="/logo.svg"
        imgClassName="!w-[98px] !h-[36px] !mr-8"
      />

      <div className="p-6 w-full h-fit overflow-hidden bg-[#90888869] justify-center items-center flex rounded-2xl">
        <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full max-w-[1100px]">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[#666] text-sm font-medium">
                  <th className="text-left pl-6 w-[150px]">Special Offer</th>
                  <th className="text-center w-[80px]">TalkTime</th>
                  <th className="text-center w-[80px]">Validity</th>
                  <th className="text-left">Description</th>
                  <th className="text-right pr-6 w-[100px]">Price</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => {
                  const isSelected = idx === 0;
                  return (
                    <tr
                      key={plan.id}
                      className={`transition-all cursor-pointer rounded-xl ${
                        isSelected
                          ? "bg-[#E7F0FF] shadow-md"
                          : "bg-white hover:shadow-md"
                      }`}
                    >
                      <td className="pl-6 py-4 rounded-l-xl text-[#3386FF] font-medium">
                        {plan.category}
                      </td>
                      <td className="text-center align-middle font-semibold text-[15px] text-gray-800">
                        {plan.talktime}
                      </td>
                      <td className="text-center align-middle font-semibold text-[15px] text-gray-800">
                        {plan.validity}
                      </td>
                      <td className="text-[12px] text-gray-600 px-4 leading-5">
                        {plan.description}
                      </td>
                      <td className="pr-6 rounded-r-xl text-right font-medium text-[#3386FF] text-[15px]">
                        {plan.price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}