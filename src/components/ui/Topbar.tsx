'use client';

import React from 'react';
import { Button, Avatar, Badge, Tooltip } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  BellOutlined,
  CheckCircleFilled,
  CrownOutlined,
} from '@ant-design/icons';

type UserInfo = {
  name: string;
  id: string;           // e.g. "R047040"
  role: string;         // e.g. "Retailer"
  avatarUrl?: string;
  verified?: boolean;   // shows the blue tick at far right
};

export type TopbarProps = {
  title?: string;                 // default: "Bill Payment"
  balance: number;                // in rupees
  onAddFunds?: () => void;
  onDebitFunds?: () => void;
  user: UserInfo;
  notifications?: number;         // bell badge count
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
  balance,
  onAddFunds,
  onDebitFunds,
  user,
  notifications = 0,
  className = '',
}) => {
  return (
    <div
      className={`w-full rounded-2xl bg-white/90 shadow-sm border border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between ${className}`}
    >
      {/* Left: Title */}
      <div className="text-sky-600 text-lg sm:text-xl font-semibold">{title}</div>

      {/* Center: Balance + actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Balance pill */}
        <div className="px-3 sm:px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold">
          {formatINR(balance)}
        </div>

        {/* Add Funds */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddFunds}
          className="!bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !rounded-full !h-8 sm:!h-9 !px-3 sm:!px-4"
        >
          Add Funds
        </Button>

        {/* Debit Funds */}
        <Button
          danger
          icon={<MinusOutlined />}
          onClick={onDebitFunds}
          className="!bg-red-500 hover:!bg-red-600 !border-none !text-white !rounded-full !h-8 sm:!h-9 !px-3 sm:!px-4"
        >
          Debit Funds
        </Button>
      </div>

      {/* Right: bell + user + verified */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <Tooltip title="Notifications">
          <Badge count={notifications} size="small">
            <button
              aria-label="Notifications"
              className="grid place-items-center w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50"
            >
              <BellOutlined className="text-slate-700" />
            </button>
          </Badge>
        </Tooltip>

        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar
            size={36}
            src={user.avatarUrl}
            className="shadow-sm"
          >
            {user.name?.[0] ?? 'U'}
          </Avatar>
          <div className="leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-[slate-800]">
              {user.name}
            </div>
            <div className="text-[11px] text-[#3386FF]">
              {user.id} ({user.role})
            </div>
          </div>
        </div>

        {/* Blue verify/“badge” button */}
        {user.verified && (
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
