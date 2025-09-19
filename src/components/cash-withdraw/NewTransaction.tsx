"use client";

import React, { useState } from "react";
import { Typography } from "antd";
import Image from "next/image";
import { services } from "@/config/app.config"; // [{key, label, icon}]
import { useRouter } from "next/navigation";
import AEPSTransactionForm from "./AEPSTransactionForm";
import BalanceEnquiry from "./BalanceEnquiry";
import MiniStatement from "./MiniStatement";
import { useAepsBankList } from "@/features/retailer/cash_withdrawl/data/hooks";
// import MiniStatement from "./MiniStatement";

const { Title, Text } = Typography;

export default function AEPSFormPage() {
  const router = useRouter();

  // which service is selected
  const [activeService, setActiveService] = useState<string | null>("cash-withdrawal");

  // map each service to a component (keys must match services config)
  const serviceComponents: Record<string, React.ReactNode> = {
    "cash-withdrawal": <AEPSTransactionForm />,
    "balance-enquiry": <BalanceEnquiry />,
    "mini-statement": <MiniStatement />,
  };

  return (
    <div className="bg-transparent space-y-3 ml-0">
      {/* AEPS Services */}
      <div className="bg-white rounded-2xl shadow-md p-6 !w-full">
        <Title level={5}>Select AEPS Service</Title>
        <Text type="secondary">Choose the service you want to provide</Text>

        <div className="flex justify-center gap-6 flex-wrap mt-4">
          {services.map(({ key, label, description, icon }) => (
            <div
              key={key}
              onClick={() => setActiveService(key)}
              className={`cursor-pointer rounded-xl p-2 transition duration-200 ${activeService === key ? "scale-105" : "opacity-80 hover:opacity-100"
                }`}
            >
              <div className={`rounded-xl w-64 p-6 flex flex-col items-center shadow-md ${activeService === key ? "bg-[#e6f0ff]" : "bg-white"
                }`}>
                <div className="bg-[#dbe6f7] rounded-full p-4 mb-4">
                  <Image
                    src={icon}
                    alt={label}
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[#2675ec] font-semibold text-lg mb-1 text-center">{label}</h3>
                <p className="text-gray-500 text-sm text-center mb-4">{description}</p>
                <div className="bg-[#dbe6f7] text-[#2675ec] text-sm font-medium px-3 py-1 rounded-full w-[60px] text-center">
                  {key === "cash-withdrawal" ? "₹0.40" : key === "balance-enquiry" ? "₹2" : "₹5"}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Active Component */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {activeService ? (
          serviceComponents[activeService] || (
            <Text type="secondary">Component not implemented yet</Text>
          )
        ) : (
          <Text type="secondary">Please select a service above</Text>
        )}
      </div>
    </div>
  );
}
