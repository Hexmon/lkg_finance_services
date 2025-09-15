"use client";

import { useState, useMemo } from "react";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

type QuickLink = {
  meta: {
    id: string;
    display: string;
    icon: string;
    route: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
  };
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string | null;
};

export default function Services({ quick_link }: { quick_link: QuickLink[] }) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const items: QuickLink[] = quick_link ?? [];
  const visibleItems = useMemo(
    () => (showAll ? items : items.slice(0, 4)),
    [showAll, items]
  );

  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <Text strong className="!font-medium !text-[20px]">Quick Services</Text>
          <span className="font-light text-[12px] text-[#1D1D1D]">
            Access your most used services instantly
          </span>
        </div>

        {/* <Button
          type="default"
          aria-label={showAll ? "Show less services" : "View all services"}
          onClick={() => setShowAll((s) => !s)}
          className="transition-all duration-300 hover:!translate-x-[1px]"
          icon={<EyeOutlined />}
        >
          {showAll ? "Show Less" : "View All"}
        </Button> */}
      </div>

      {/* Grid */}
      <div
        key={showAll ? "all" : "four"}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8f8f890] mt-4"
      >
        {visibleItems.map((data, index) => {
          const delay = `${(index % 8) * 50}ms`;
          return (
            <div
              key={data.meta.id ?? data.category_id}
              className="opacity-0 translate-y-2 scale-[0.98] animate-[cardIn_500ms_ease-out_forwards]"
              style={{ animationDelay: delay as unknown as string }}
            >
              <CardLayout
                height="h-fit"
                elevation={2}
                bgColor="bg-white"
                body={
                  <div className="flex flex-col justify-between items-center">
                    {/* Icon */}
                    <div className="bg-[#5298FF54] rounded-full p-3 transition-transform duration-300 hover:scale-105">
                      <Image
                        src={data.meta.icon}
                        alt={data.name || data.meta.display}
                        width={35}
                        height={35}
                      />
                    </div>

                    {/* Title */}
                    <Text className="!text-[#232323] !font-medium !text-[14px] mt-2 text-center">
                      {data.meta.display || data.name}
                    </Text>

                    {/* Description */}
                    <Text className="!text-[12px] !font-medium !text-[#787878] mb-4 text-center">
                      {data.description}
                    </Text>

                    {/* CTA */}
                    <Button
                      size="middle"
                      onClick={() => router.push(data.meta.route ?? "/")}
                      type="primary"
                      className="!bg-[#3386FF] w-[80%] !rounded-xl transition-all duration-300 hover:!bg-[#2366CC] hover:!shadow-md"
                    >
                      Get Started{" "}
                      <Image src="/icons/Arrow.svg" width={12} height={12} alt="" />
                    </Button>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>

      {/* Tailwind keyframes (global) */}
      <style jsx global>{`
        @keyframes cardIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          60% {
            opacity: 1;
            transform: translateY(0) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </Card>
  );
}
