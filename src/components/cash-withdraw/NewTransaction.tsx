"use client";

import React, { useState } from "react";
import { Typography } from "antd";
import Image from "next/image";
import { services } from "@/config/app.config"; // [{key, label, icon}]
import { useRouter } from "next/navigation";
import AEPSTransactionForm from "./AEPSTransactionForm";
import BalanceEnquiry from "./BalanceEnquiry";
import MiniStatement from "./MiniStatement";
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
    "mini-statement": <MiniStatement/>,
  };

  return (
    <div className="bg-transparent space-y-3 ml-0">
      {/* AEPS Services */}
      <div className="bg-white rounded-2xl shadow-md p-6 !w-full">
        <Title level={5}>Select AEPS Service</Title>
        <Text type="secondary">Choose the service you want to provide</Text>

        <div className="flex justify-center gap-6 flex-wrap mt-4">
          {services.map(({ key, label, icon }) => (
            <div  
              key={key}
              onClick={() => setActiveService(key)}
              className={`cursor-pointer rounded-xl p-2 transition ${
                activeService === key
                  ? ""
                  : ""
              }`}
            >
              <Image
                src={icon}
                alt={label}
                width={139}
                height={137}
                className="object-contain"
                priority
              />
              <p className="text-center mt-1 text-sm font-medium">{label}</p>
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
