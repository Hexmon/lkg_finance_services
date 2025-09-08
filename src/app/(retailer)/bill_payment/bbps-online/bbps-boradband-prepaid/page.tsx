"use client";

import React from "react";
import Image from "next/image";
import { Card, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";

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
      <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      <div className="p-6 bg-[#e9e1d1] min-h-screen w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2 text-gray-800">
              <LeftOutlined />
              <Title level={4} className="!mb-0">
                Broadband Prepaid
              </Title>
            </div>
            <Text type="secondary" className="ml-6">
              Recharge
            </Text>
          </div>

          <Image
            src="/logo.svg"
            alt="logo"
            width={120}
            height={80}
            className="p-1"
          />
        </div>

        {/* Table Card */}
        <Card className="rounded-2xl shadow-md w-full bg-[#fdf8f3] p-4">
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
                <tr key={index} className="align-top">
                  <td className="p-3">
                    {plan.highlight ? (
                      <span className="px-3 py-1 bg-[#cfe1f8] text-blue-600 font-medium rounded-md shadow-sm">
                        {plan.category}
                      </span>
                    ) : (
                      <span className="text-gray-800">{plan.category || "-"}</span>
                    )}
                  </td>
                  <td
                    className={`p-3 font-medium ${plan.highlight ? "bg-[#cfe1f8] rounded-md" : ""
                      }`}
                  >
                    {plan.talktime}
                  </td>
                  <td
                    className={`p-3 font-medium ${plan.highlight ? "bg-[#cfe1f8] rounded-md" : ""
                      }`}
                  >
                    {plan.validity}
                  </td>
                  <td
                    className={`p-3 text-sm text-gray-700 ${plan.highlight ? "bg-[#cfe1f8] rounded-md" : ""
                      }`}
                  >
                    {plan.description}
                  </td>
                  <td
                    className={`p-3 font-semibold text-blue-600 ${plan.highlight ? "bg-[#cfe1f8] rounded-md" : ""
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
    </DashboardLayout>
  );
}
