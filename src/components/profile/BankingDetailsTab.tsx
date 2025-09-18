'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Typography } from 'antd';

const { Text } = Typography;

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

const BankingDetailsForm: React.FC = () => {
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


// Main component to switch between cards and form
const BankingDetailsTab: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const accounts = [
    { id: '1', name: 'Rajesh Saini', bank: 'HDFC Bank', account: '1234567890', ifsc: 'HDFC0001234' },
    { id: '2', name: 'Amit Sharma', bank: 'ICICI Bank', account: '9876543210', ifsc: 'ICIC0005678' },
    { id: '2', name: 'Rakesh Sharma', bank: 'SBI Bank', account: '9876543210', ifsc: 'SBIN0005678' },
  ];

  if (showForm) {
    return <BankingDetailsForm />;
  }

  return (
    <>
    {/* Add Bank CTA */ }
    < div className = "flex justify-end mt-6" >
      <Button
        type="primary"
        onClick={() => setShowForm(true)}
        className="!h-[39PX] !W-[164.93px] !text-[12px] !font-medium !rounded-xl !bg-[#1677ff] !border-none px-6"
      >
        + Add Bank Account
      </Button>
      </div >
  <div className="w-full">
    <div className="flex gap-6 mt-8 flex-wrap mb-6 justify-center items-center">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          onClick={() => setSelectedId(acc.id)}
          className={`flex items-start gap-4 border rounded-2xl p-4 w-[280px] cursor-pointer transition ${selectedId === acc.id
              ? 'border-blue-500 shadow-md'
              : 'border-gray-200'
            }`}
        >
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="bg-[#5298FF54] rounded-full w-[55px] h-[55px] flex items-center justify-center shrink-0">
                <Image
                  src="/person-blue.svg"
                  alt="person"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col ml-3">
                <Text strong className="text-[15px]">
                  {acc.name}
                </Text>
                <Text type="secondary" className="text-[14px]">
                  {acc.bank}
                </Text>
              </div>

              <Image
                src={
                  selectedId === acc.id
                    ? '/tick-blue.svg'
                    : '/tick-gray.svg'
                }
                alt="tick"
                width={15}
                height={15}
                className="ml-6"
              />
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex justify-between">
                <Text type="secondary">Account:</Text>
                <Text className="font-semibold">{acc.account}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">IFSC Code:</Text>
                <Text strong>{acc.ifsc}</Text>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>


  </div>
  </>
  );
};

export default BankingDetailsTab;
