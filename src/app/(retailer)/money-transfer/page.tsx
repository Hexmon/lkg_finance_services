"use client";

import React from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";

export default function BillPaymentServicePage() {
  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
      <DashboardSectionHeader
        title="Money Transfer Service"
        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
        arrowClassName="!text-[#3386FF]"
      />
      dashbaord money transfer
      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}

