'use client';

import React, { useState } from 'react';
import { Button, Avatar, Tooltip, Popover } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/lib/store';
import { selectProfileLoaded, selectUserType, selectProfileCore, selectBalances } from '@/lib/store/slices/profileSlice';
import { useRouter } from "next/navigation";
import Image from "next/image";

export type TopbarProps = {
  title?: string;
  onAddFunds?: () => void;
  onDebitFunds?: () => void;
  className?: string;
};

function formatINR(n: number) {
  // Indian numbering system with ₹
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

const Topbar: React.FC<TopbarProps> = ({
  title = '',
  onAddFunds,
  onDebitFunds,
  className = '',
}) => {

  const core = useAppSelector(selectProfileCore);
  const loaded = useAppSelector(selectProfileLoaded);
  const userType = useAppSelector(selectUserType);
  const balances = useAppSelector(selectBalances);

  const { profile, name, aadhaar_verified, accepted_terms, email_verified, pan_verified } = core || {}
  const isVerified = aadhaar_verified && accepted_terms && email_verified && pan_verified
  const balanceAmount = balances[0]?.balance ?? 0

  const router = useRouter();
    const [role, setRole] = useState("Distributor");

  // Popover Content
  const content = (
    <div className="bg-[#FFFFFF] p-4 w-[300px] rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-[23px] h-[23px] flex items-center justify-center rounded-full bg-[#3386FF] text-white">
          <CrownOutlined />
        </div>
        <h2 className="!text-[14px] !font-normal">Upgrade Your Account</h2>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 mb-5">
        <Image
          src="/girl-profile.svg"
          alt="profile"
          width={29}
          height={28}
          className='object-contain'
        />
        <div>
          <p className="text-[14px] font-medium">Rajesh Saini</p>
          <p className="text-[#3386FF] text-[11px] font-light">R0470140 (Retailer)</p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setRole("Distributor")}
          className={`flex-1 rounded-lg border px-4 py-2 w-[96px] h-[32px] text-[8px] font-normal ${
            role === "Distributor"
              ? "bg-[#3386FF] text-white"
              : "border-[#3386FF] text-[#3386FF]"
          }`}
        >
          Distributor
        </button>
        <button
          onClick={() => setRole("Super Distributor")}
          className={`flex-1 rounded-lg border px-4 py-2 w-[96px] h-[32px] text-[8px] font-normal ${
            role === "Super Distributor"
              ? "bg-[#FCFCFC] text-white"
              : "border-blue-400 text-[#3386FF]"
          }`}
        >
          Super Distributor
        </button>
      </div>

      {/* Upgrade Button */}
      <div className='flex justify-center items-center'>
        <button className="w-[136px] h-[32px] bg-[#3386FF] text-white py-2 rounded-lg font-medium shadow hover:bg-blue-600 transition text-[12px] ">
        Upgrade
      </button>
      </div>
    </div>
  );
  return (
    <div
      className={`w-full rounded-2xl bg-white/90 shadow-md border border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between ${className}`}
    >
      {/* Left: Title */}
      <div className="text-sky-600 text-lg sm:text-xl font-semibold">{title}</div>

      {/* Center: Balance + actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Balance pill */}
        <div className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold">
          {formatINR(balanceAmount)}
        </div>

        {/* Add Funds */}
        <Button
          type="primary"
          icon={<PlusOutlined className='!border-1 !border-white rounded-full ' />}
          onClick={onAddFunds}
          className="!bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !rounded-xl !h-8 sm:!h-9 !px-3 sm:!px-4"
        >
          Add Funds
        </Button>

        {/* Debit Funds */}
        <Button
          danger
          icon={<MinusOutlined className='!border-1 !border-white rounded-full' />}
          onClick={onDebitFunds}
          className="!bg-red-500 hover:!bg-red-600 !border-none !text-white !rounded-xl !h-8 sm:!h-9 !px-3 sm:!px-4"
        >
          Debit Funds
        </Button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <Avatar
            size={36}
            src={profile}
            className="shadow-sm"
          >
            {profile}
          </Avatar>
          <div className="leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-[slate-800]">
              {name}
            </div>
            <div className="text-[11px] text-[#3386FF]">
              {/* {profile_id ?? ""} ({userType ?? ""}) */}
              RA175900435 ({userType ?? ""})
            </div>
          </div>
        </div>

        {/* Blue verify/“badge” button */}
        {isVerified && (
<div className="relative flex items-center">
      <Popover
        content={content}
        trigger="click"
        placement="bottomRight"
        overlayInnerStyle={{ padding: 0, borderRadius: "16px" }}
      >
        {/* Blue verify/“badge” button */}
        <Tooltip title="Verified">
          <div className="w-[23px] h-[23px] rounded-full bg-[#3386FF] place-items-center shadow-sm flex items-center justify-center cursor-pointer">
            <CrownOutlined
              style={{
                color: "white",
                fontSize: "16px",
                width: "18px",
                height: "18px",
                marginLeft: "1px",
              }}
            />
          </div>
        </Tooltip>
      </Popover>
    </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
