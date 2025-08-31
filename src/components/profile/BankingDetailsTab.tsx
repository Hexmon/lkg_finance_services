'use client';

import React, { useState } from 'react';
import { Button } from 'antd';

type FieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Field: React.FC<FieldProps> = ({
  id,
  label,
  placeholder,
  className = '',
  type = 'text',
  disabled,
  value,
  onChange,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[13px] leading-[18px] text-[#3F3F3F] mb-[6px] font-medium"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder ?? ''}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={[
          'block w-full h-9 rounded-md border px-3 outline-none transition-colors',
          disabled
            ? 'border-[#E6E6E6] bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            : 'border-[#E6E6E6] bg-white focus:border-[#3B82F6] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.18)]',
        ].join(' ')}
      />
    </div>
  );
};

const ProfileBlock: React.FC = () => {
  return (
    <div className="flex flex-col items-center pt-1">
      <div className="relative w-[112px] h-[112px] rounded-full bg-[#DCEBFF] border border-[#E6EEFF]" />
      <div className="mt-4 text-[14px] leading-[18px] text-[#232323] font-medium">
        Rajesh Saini
      </div>
      <div className="mt-1 text-[12px] leading-[16px] text-[#9CA3AF] font-semibold tracking-wide">
        @R00470170
      </div>
    </div>
  );
};

const BankingDetailsTab: React.FC = () => {
  // IFSC mirrors to the read-only field on the right
  const [ifsc, setIfsc] = useState('SBI7474887');
  // optional: show a sample branch chip when IFSC has value
  const branchLabel =
    'HDFC Bank - MG Road Branch, Bangalore, Karnataka';

  return (
    <div className="w-full">
      <div
        className="grid"
        style={{
          gridTemplateColumns: '180px 1fr', // left profile block, right form
          columnGap: '28px',
        }}
      >
        {/* Left avatar/name */}
        <div className="min-h-[120px]">
          <ProfileBlock />
        </div>

        {/* Right form (2 columns) */}
        <div className="w-full">
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              columnGap: '28px',
              rowGap: '18px',
            }}
          >
            {/* Row 1 */}
            <div>
              <Field
                id="ifsc1"
                label="IFSC"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
              />
              {ifsc ? (
                <div className="mt-1 inline-block rounded-full border border-[#C7E0FF] bg-[#EAF3FF] px-2 py-[2px] text-[11px] leading-[14px] text-[#2F6FE4]">
                  {branchLabel}
                </div>
              ) : null}
            </div>
            <Field id="accountNumber" label="Account Number" placeholder="" />

            {/* Row 2 */}
            <Field
              id="confirmAccountNumber"
              label="Confirm Account Number"
              placeholder=""
            />
            <Field id="ifsc2" label="IFSC" value={ifsc} disabled />

            {/* Row 3 */}
            <Field id="accountType" label="Account Type" placeholder="" />
            <Field
              id="accountHolder"
              label="Account Holder Name"
              placeholder=""
            />
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <Button
              type="primary"
              className="!h-11 !rounded-xl !bg-[#1677ff] !border-none px-6
                         transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
            >
              Verify &amp; Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingDetailsTab;
