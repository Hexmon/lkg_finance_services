"use client";

import React from "react";
import Image from "next/image";
import { Card, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";

const { Title, Text } = Typography;

const plans = [
  {
    category: "Special Offer",
    talktime: "0",
    validity: "30",
    description:
      "Vas Package including SMS, WAPV, Validity extension cannot be done with this STV",
    price: "₹799",
    highlight: true,
  },
  {
    category: "Top up",
    talktime: "0",
    validity: "30",
    description:
      "Vas Package including SMS, WAPV, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    category: "Full Talktime",
    talktime: "0",
    validity: "30",
    description:
      "Vas Package including SMS, WAPV, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    category: "Rate Cutter",
    talktime: "0",
    validity: "30",
    description:
      "Vas Package including SMS, WAPV, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    category: "",
    talktime: "0",
    validity: "30",
    description:
      "Vas Package including SMS, WAPV, Validity extension cannot be done with this STV",
    price: "₹799",
  },
  {
    category: "",
    talktime: "0",
    validity: "30",
    description:
      "Vas Package including SMS, WAPV, Validity extension cannot be done with this STV",
    price: "₹799",
  },
];

export default function BroadbandPrepaid() {
  return (
      <DashboardLayout activePath="/bill_payment" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
            <div className="min-h-screen w-full mb-3">
              <div className="flex justify-between items-center">
                <DashboardSectionHeader
                  title="Mobile Prepaid"
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

        {/* Table Card */}
        <div className="bg-[#90888869] py-4 px-8 rounded-xl">
          <Card className="rounded-2xl shadow-md w-full bg-[#fdf8f3] p-4 h-[496px]">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="pb-3">Category</th>
                <th className="pb-3">TalkTime</th>
                <th className="pb-3">Validity</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={index} className="align-top !h-[45px]">
                  <td className="p-3 !h-[45px]">
                    {plan.highlight ? (
                      <span className="px-3 py-1 bg-[#cfe1f8] text-blue-600 font-medium rounded-md shadow-sm ">
                        {plan.category}
                      </span>
                    ) : (
                      <span className="text-gray-800">{plan.category || "-"}</span>
                    )}
                  </td>
                  <td
                    className={`p-3 font-medium ${plan.highlight ? "bg-[#cfe1f8] rounded-md !h-[45px]" : ""
                      }`}
                  >
                    {plan.talktime}
                  </td>
                  <td
                    className={`p-3 font-medium ${plan.highlight ? "bg-[#cfe1f8] rounded-md !h-[45px]" : ""
                      }`}
                  >
                    {plan.validity}
                  </td>
                  <td
                    className={`p-3 text-sm text-gray-700 ${plan.highlight ? "bg-[#cfe1f8] rounded-md !h-[45px]" : ""
                      }`}
                  >
                    {plan.description}
                  </td>
                  <td
                    className={`p-3 font-semibold text-blue-600 ${plan.highlight ? "bg-[#cfe1f8] rounded-md !h-[45px]" : ""
                      }`}
                  >
                    {plan.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
