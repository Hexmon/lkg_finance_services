'use client';

import React, { useState } from 'react';
import { Button, Avatar, Tooltip, Popover } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  CrownOutlined,
  DownOutlined,
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
          className={`flex-1 rounded-lg border px-4 py-2 w-[96px] h-[32px] text-[8px] font-normal ${role === "Distributor"
            ? "bg-[#3386FF] text-white"
            : "border-[#3386FF] text-[#3386FF]"
            }`}
        >
          Distributor
        </button>
        <button
          onClick={() => setRole("Super Distributor")}
          className={`flex-1 rounded-lg border px-4 py-2 w-[96px] h-[32px] text-[8px] font-normal ${role === "Super Distributor"
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

  const money_drp_dwn = (
    <div className="bg-[#FFFFFF] p-2 rounded-xl shadow-md w-[200px]">
      <div className="flex justify-between text-[13px] mb-2">
        <span className="text-gray-700">Main Wallet</span>
        <span className="font-medium">₹15,000</span>
      </div>
      <div className="flex justify-between text-[13px]">
        <span className="text-gray-700">AEPS Wallet</span>
        <span className="font-medium">₹10,000</span>
      </div>
    </div>
  );

  const pg_drp_dwn = (
  <div className="bg-[#FFFFFF] p-2 rounded-xl shadow-md w-[180px]">
    <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded-lg cursor-pointer">
      <Image 
      src="/bank-black.svg"
      alt="bank imgae"
      width={15.91}
      height={15}
      />
      <span className="text-[13px] text-gray-700">Payment Gateway (PG)</span>
    </div>
    <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded-lg cursor-pointer">
      <Image 
      src="/rocket-black.svg"
      alt="bank imgae"
      width={15.91}
      height={15}
      />
      <span className="text-[13px] text-gray-700">Fund Request</span>
    </div>
  </div>
);

  const debit_funds_drp_dwn = (
    <div className="bg-[#FFFFFF] p-2 rounded-xl shadow-md w-[200px]">
      {/* Move to Wallet */}
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 cursor-pointer">
        <Image
          src="/credit-card-blue.svg"
          alt="credit card"
          width={16}
          height={17}
          className='object-contain'
        />
        <span className="text-[14px] text-gray-700 font-medium"
        onClick={()=> router.push("/money_transfer/move_to_wallet")}
        >Move to Wallet</span>
      </div>

      {/* Move to Bank */}
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <Image
          src="/bank-black.svg"
          alt="credit card"
          width={16}
          height={17}
          className='object-contain'
        />
        <span className="text-[14px] text-gray-700 font-medium"
        onClick={()=> router.push("/money_transfer/bank_withdrawl")}
        >Move To Bank</span>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full rounded-2xl bg-white/90 shadow-md border border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between ${className} top-[13px]`}
    >
      {/* Left: Title */}
      <div className="text-sky-600 text-lg sm:text-xl font-semibold">{title}</div>

      {/* Center: Balance + actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Balance pill */}
        <div className="">
          <Popover
            content={money_drp_dwn}
            trigger="click"
            placement="bottomRight"
            overlayInnerStyle={{ padding: 0, borderRadius: "12px" }}
          >
            <button className="flex items-center gap-1 px-3 py-1 bg-[#EBEBEB] rounded-lg font-semibold shadow-sm">
              {formatINR(balanceAmount)}
            </button>
          </Popover>
        </div>

        {/* Add Funds */}
        <Popover
      content={pg_drp_dwn}
      trigger="click"
      placement="bottomRight"
      overlayInnerStyle={{ padding: 0, borderRadius: "12px" }}
    >
        <Button
          type="primary"
          icon={<PlusOutlined className='!border-1 !border-white rounded-full ' />}
          onClick={onAddFunds}
          className="!bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !rounded-xl !h-8 sm:!h-9 !px-3 sm:!px-4"
        >
              
          Add Funds
        </Button>
</Popover>
        {/* Debit Funds */}
    <Popover
      content={debit_funds_drp_dwn}
      trigger="click"
      placement="bottomRight"
      overlayInnerStyle={{ padding: 0, borderRadius: "12px" }}
    >
        <Button
          danger
          icon={<MinusOutlined className='!border-1 !border-white rounded-full' />}
          onClick={onDebitFunds}
          className="!bg-red-500 hover:!bg-red-600 !border-none !text-white !rounded-xl !h-8 sm:!h-9 !px-3 sm:!px-4"
        >
          Debit Funds
        </Button>
    </Popover>
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
