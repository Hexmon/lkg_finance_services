"use client";

import { CardLayout } from "@/lib/layouts/CardLayout";
import { Card, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

// Accept flexible inputs and normalize inside
type BalancesInput =
  | { MAIN: number; AEPS: number }
  | Record<string, number>;

type CommissionsInput =
  | { overall: string }
  | {
    overall: number;
    overall_ratio?: number;
    current_month?: number;
    current_month_ratio?: number;
    last_month?: number;
  };

export default function WalletOverview({
  balances,
  commissions,
}: {
  balances: BalancesInput;
  commissions: CommissionsInput;
}) {
  // --- Normalizers ---
  const getNumber = (v: unknown, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const main = getNumber((balances as Record<string, number>)["MAIN"]);
  const aeps = getNumber((balances as Record<string, number>)["AEPS"]);

  // commissions.overall might be string or number: coerce to number for math/formatting
  const overallCommission = getNumber(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (commissions as any)?.overall // string or number
  );

  const formatINR = (n: number) =>
    n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  const router = useRouter();
  return (
    <Card className="!rounded-2xl !shadow-sm !w-full !mb-10">
      <div className="flex justify-between items-start w-full mb-4">
        <div>
          <Text strong className="block !font-semibold !text-[20px] mb-0">
            Wallet Overview
          </Text>
          <Text className="!font-light !text-sm !text-[13px]">
            Manage Your Financial Account
          </Text>
        </div>

        {/* use a button later if you want onClick */}
        <div className="w-[111px] h-[29px] flex items-center cursor-pointer shadow-[0px_4px_8.9px_rgba(0,0,0,0.1)] rounded-[9px] justify-center"
        onClick={() => router.push('/reports_analysis')}
        >
          <Image src="/eye.svg" alt="eye icon" width={15} height={15} />
          <Text className="!font-normal !text-[10px] ml-2 mt-[2px]">View All</Text>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CardLayout
          className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
          header={
            <div className="flex justify-between items-start w-full">
              <div className="p-2 rounded-full w-18 h-18 flex items-center justify-center">
                <Image src="https://pub-dcebb8dd7f554f2681fa24f286407352.r2.dev/abaa6a2f7f1645db801a0c67acec528f.png" alt="" width={35} height={35} className="size-full" />
              </div>
              <div className="flex justify-center items-center space-x-1">
                <Image src="/icons/Trendingup.svg" alt="growth" width={14} height={14} />
                <span className="text-[#3386FF] text-[12px] font-bold">+3.2%</span>
              </div>
            </div>
          }
          body={
            <div>
              <p className="text-[24px] font-bold text-black mt-2">
                {formatINR(main)}
              </p>
              <p className="text-gray-500 text-[14px] font-medium mt-1">Main Wallet</p>
            </div>
          }
        />

        <CardLayout
          className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
          header={
            <div className="flex justify-between items-start w-full">
              <div className="p-2 rounded-full w-18 h-18 flex items-center justify-center">
                <Image src="https://pub-dcebb8dd7f554f2681fa24f286407352.r2.dev/abaa6a2f7f1645db801a0c67acec528f.png" alt="" width={35} height={35} className="size-full" />
              </div>
              <div className="flex justify-center items-center space-x-1">
                <Image src="/icons/Trendingup.svg" alt="growth" width={14} height={14} />
                <span className="text-[#3386FF] text-[12px] font-bold">+3.2%</span>
              </div>
            </div>
          }
          body={
            <div>
              <p className="text-[24px] font-bold text-black mt-2">
                {formatINR(aeps)}
              </p>
              <p className="text-gray-500 text-[14px] font-medium mt-1">AEPS Wallet</p>
            </div>
          }
        />

        <CardLayout
          className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
          header={
            <div className="flex justify-between items-start w-full">
              <div className="p-2 rounded-full w-18 h-18 flex items-center justify-center">
                <Image src="https://pub-dcebb8dd7f554f2681fa24f286407352.r2.dev/abaa6a2f7f1645db801a0c67acec528f.png" alt="" width={35} height={35} className="size-full" />
              </div>
              <div className="flex justify-center items-center space-x-1">
                <Image src="/icons/Trendingup.svg" alt="growth" width={14} height={14} />
                <span className="text-[#3386FF] text-[12px] font-bold">+3.2%</span>
              </div>
            </div>
          }
          body={
            <div>
              <p className="text-[24px] font-bold text-black mt-2">
                {formatINR(overallCommission)}
              </p>
              <p className="text-gray-500 text-[14px] font-medium mt-1">Commission</p>
            </div>
          }
        />
      </div>
    </Card>
  );
}
