"use client";

import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";

type Props = {
  title: string;
};

export default function BillDetailsHeader({ title }: Props) {
  return (
    <div className="flex justify-between items-center">
      <DashboardSectionHeader
        title={title ?? ""}
        titleClassName="!font-medium text-[20px] !mt-0"
        subtitle="Bill Payment"
        subtitleClassName="!mb-4 !text-[14px]"
        showBack
      />
      <Image src="/logo.svg" alt="logo" width={100} height={100} className="p-1" />
    </div>
  );
}
