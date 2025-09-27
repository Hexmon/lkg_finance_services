'use client';

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button, Typography } from 'antd';
import {
  useBankAccounts,
  useDeleteBankAccount,
  useAddBankAccount,
} from '@/features/retailer/bank_account/data/hooks';
import { useVerifyIfsc } from '@/features/retailer/dmt/beneficiaries/data/hooks';
import { useAppSelector, selectUserId } from '@/lib/store';
import SmartSelect from '../ui/SmartSelect';

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

type BankingDetailsFormProps = {
  onDone?: () => void; // <-- added
};

const BankingDetailsForm: React.FC<BankingDetailsFormProps> = ({ onDone }) => {
  // IFSC mirrors to the read-only field on the right
  const [ifsc, setIfsc] = useState('SBI7474887');

  // other fields (controlled; UI unchanged)
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [accountType, setAccountType] = useState(''); // SAVINGS | CURRENT
  const [accountHolder, setAccountHolder] = useState('');

  // IFSC verification hook
  const {
    verifyIfscAsync,
    isLoading: isVerifyingIfsc,
    data: ifscRes,
    reset: resetIfsc,
  } = useVerifyIfsc();
  const lastVerifiedIfsc = useRef<string | null>(null);

  // Add bank account hook
  const addBank = useAddBankAccount();

  // IFSC regex (same as schema)
  const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  // derive IFSC state
  const normalizedIfsc = (ifsc || '').toUpperCase();
  const isIfscFormatComplete = IFSC_REGEX.test(normalizedIfsc);

  // Consider "verified" when the verify API succeeded with a 2xx code
  const isIfscVerifiedOk = Boolean(
    isIfscFormatComplete &&
      ifscRes &&
      ifscRes.success &&
      ifscRes.status_code >= 200 &&
      ifscRes.status_code < 400
  );

  // auto-verify IFSC when format complete & different from last verified
  useEffect(() => {
    if (!isIfscFormatComplete) {
      lastVerifiedIfsc.current = null;
      resetIfsc();
      return;
    }
    if (lastVerifiedIfsc.current === normalizedIfsc) return;
    (async () => {
      try {
        await verifyIfscAsync({ ifsc_code: normalizedIfsc });
        lastVerifiedIfsc.current = normalizedIfsc;
      } catch {
        lastVerifiedIfsc.current = null;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedIfsc, isIfscFormatComplete]);

  // Disable all inputs except IFSC, and button, until IFSC verified OK
  const fieldsDisabled = !isIfscVerifiedOk || isVerifyingIfsc;

  // chip ONLY after successful IFSC verification, using verified data (no hardcode)
  const branchLabel = useMemo(() => {
    const d = ifscRes?.data;
    if (isIfscVerifiedOk && d) {
      const bank = d.bank || '';
      const branch = d.branch || '';
      const city = d.city || '';
      const state = d.state || '';
      const parts = [bank, branch, city, state].filter(Boolean);
      return parts.join(' - ').replace(' - ,', ',').replace(' ,', ',');
    }
    return '';
  }, [ifscRes, isIfscVerifiedOk]);

  // Account type options (non-searchable single select)
  const accountTypeOptions = useMemo(
    () => [
      { label: 'SAVINGS', value: 'SAVINGS' },
      { label: 'CURRENT', value: 'CURRENT' },
    ],
    []
  );

  // button enabled only when everything valid
  const numbersMatch =
    accountNumber.length > 0 && accountNumber === confirmAccountNumber;
  const canSubmit =
    isIfscVerifiedOk &&
    !isVerifyingIfsc &&
    !addBank.isPending &&
    numbersMatch &&
    accountType.trim().length > 0 &&
    accountHolder.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    addBank.mutate(
      {
        account_number: accountNumber,
        account_holder_name: accountHolder,
        account_type: accountType,
        ifsc_code: normalizedIfsc,
      },
      {
        onSuccess: () => {
          // close the form after successful API call
          onDone?.();
        },
      }
    );
  }, [
    addBank,
    canSubmit,
    accountNumber,
    accountHolder,
    accountType,
    normalizedIfsc,
    onDone,
  ]);

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
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              />
              {isIfscVerifiedOk && ifscRes?.data ? (
                <div className="mt-1 inline-block rounded-full border border-[#C7E0FF] bg-[#EAF3FF] px-2 py-[2px] text-[11px] leading-[14px] text-[#2F6FE4]">
                  {branchLabel}
                </div>
              ) : null}
            </div>
            <Field
              id="accountNumber"
              label="Account Number"
              placeholder=""
              disabled={fieldsDisabled}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            {/* Row 2 */}
            <Field
              id="confirmAccountNumber"
              label="Confirm Account Number"
              placeholder=""
              disabled={fieldsDisabled}
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value)}
            />
            <Field id="ifsc2" label="IFSC" value={normalizedIfsc} disabled />

            {/* Row 3 */}
            {/* Account Type dropdown (SmartSelect) */}
            <div>
              <label className="block text-[13px] leading-[18px] text-[#3F3F3F] mb-[6px] font-medium">
                Account Type
              </label>
              <SmartSelect
                options={accountTypeOptions}
                value={accountType || null}
                onChange={(val) => setAccountType((val as string | null) ?? '')}
                placeholder=""
                disabled={fieldsDisabled}
                dense
                allowClear={false}
                popupMatchSelectWidth
              />
            </div>

            <Field
              id="accountHolder"
              label="Account Holder Name"
              placeholder=""
              disabled={fieldsDisabled}
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <Button
              type="primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
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

  // --- integrate GET & DELETE hooks (no UI changes) ---
  const userId = useAppSelector(selectUserId) || '';
  const { data } = useBankAccounts(userId, !!userId);
  const deleteMutation = useDeleteBankAccount(userId);

  // map API records to the existing card shape
  const accounts = useMemo(() => {
    const records = data?.data ?? [];
    return records.map((r) => ({
      id: r.account_id,
      name: r.account_holder_name,
      bank: r.bank_name,
      account: r.last4 ? `•••• ${r.last4}` : '••••',
      ifsc: r.ifsc_code,
    }));
  }, [data]);

  const handleDelete = useCallback(
    (accountId: string) => {
      if (!userId) return;
      const ok = window.confirm('Delete this bank account?');
      if (!ok) return;
      deleteMutation.mutate(
        { account_id: accountId },
        {
          onSuccess: () => {
            if (selectedId === accountId) setSelectedId(null);
          },
        }
      );
    },
    [deleteMutation, selectedId, userId]
  );

  if (showForm) {
    return <BankingDetailsForm onDone={() => setShowForm(false)} />; // <-- close form on success
  }

  return (
    <>
      {/* Add Bank CTA */}
      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          onClick={() => setShowForm(true)}
          className="!h-[39PX] !W-[164.93px] !text-[12px] !font-medium !rounded-xl !bg-[#1677ff] !border-none px-6"
        >
          + Add Bank Account
        </Button>
      </div>

      <div className="w-full">
        <div className="flex gap-6 mt-8 flex-wrap mb-6 justify-center items-center">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => setSelectedId(acc.id)}
              onDoubleClick={() => handleDelete(acc.id)} // delete on double-click (no UI change)
              className={`flex items-start gap-4 border rounded-2xl p-4 w-[280px] cursor-pointer transition ${
                selectedId === acc.id ? 'border-blue-500 shadow-md' : 'border-gray-200'
              }`}
              title="Double-click to delete"
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
                    src={selectedId === acc.id ? '/tick-blue.svg' : '/tick-gray.svg'}
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
          {/* If no accounts, render nothing extra to preserve UI */}
        </div>
      </div>
    </>
  );
};

export default BankingDetailsTab;
