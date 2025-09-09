'use client';

import React from 'react';
import { Button, Avatar, Tooltip } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/lib/store';
import { selectProfileLoaded, selectUserType, selectProfileCore, selectBalances } from '@/lib/store/slices/profileSlice';

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
        <div className="flex items-center gap-2">
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
          <Tooltip title="Verified">
            {/* <div className="w-8 h-8 rounded-full bg-sky-500 grid place-items-center shadow-sm"> */}
            <CrownOutlined className="text-white text-base" />
            {/* </div> */}
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Topbar;
