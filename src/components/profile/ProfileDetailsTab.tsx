'use client';

import React from 'react';
import { useProfileQuery } from '@/features/profile/data/hooks';
import { selectUserId, useAppSelector } from '@/lib/store';
import { selectProfileLoaded } from '@/lib/store/slices/profileSlice';

type FieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string | number | null | undefined;
  disabled?: boolean;
  readOnly?: boolean;
};

const Field: React.FC<FieldProps> = ({
  id,
  label,
  placeholder,
  className = '',
  type = 'text',
  value,
  disabled = false,
  readOnly = false,
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
        value={value ?? ''}
        readOnly={readOnly || disabled} // suppress React read-only warning
        disabled={disabled}
        className="block w-full h-9 rounded-md border border-[#E6E6E6] bg-white px-3 outline-none
                   focus:border-[#3B82F6] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.18)]
                   transition-colors disabled:bg-[#F8F9FB] disabled:text-[#6B7280]"
      />
    </div>
  );
};

const ProfileBlock: React.FC<{ name?: string; urn?: string }> = ({ name, urn }) => {
  return (
    <div className="flex flex-col items-center pt-1">
      <div className="relative w-[112px] h-[112px] rounded-full bg-[#DCEBFF] border border-[#E6EEFF]" />
      <div className="mt-4 text-[14px] leading-[18px] text-[#232323] font-medium">
        {name || '—'}
      </div>
      <div className="mt-1 text-[12px] leading-[16px] text-[#9CA3AF] font-semibold tracking-wide">
        {urn ? `@${urn}` : '—'}
      </div>
    </div>
  );
};

/** pixel-tight layout to match screenshot */
const ProfileDetailsTab: React.FC = () => {
  const userId = useAppSelector(selectUserId);
  const loaded = useAppSelector(selectProfileLoaded);

  const { data, isFetching } = useProfileQuery(
    { enabled: !!userId && !loaded }
  );

  const p = data?.data; // ProfileCore

  // (Optional) simple normalizers
  const genderPretty =
    typeof p?.gender === 'string'
      ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase()
      : '';

  return (
    <div className="w-full">
      <div
        className="grid"
        style={{
          gridTemplateColumns: '180px 1fr',
          columnGap: '28px',
        }}
      >
        {/* Left avatar/name */}
        <div className="min-h-[120px]">
          <ProfileBlock name={p?.name} urn={p?.urn} />
        </div>

        {/* Right form (3 columns) */}
        <div className="w-full">
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              columnGap: '28px',
              rowGap: '18px',
            }}
          >
            <Field id="applicantName" label="Applicant Name:" value={p?.name} disabled readOnly />

            <Field id="email" label="Email:" type="email" value={p?.email} disabled readOnly />

            <Field id="mobile" label="Mobile No.:" value={p?.mobile} disabled readOnly />
            <Field id="dob" label="Date Of Birth:" value={p?.dob} disabled readOnly />
            <Field id="gender" label="Gender:" value={genderPretty} disabled readOnly />
          </div>

          {/* If you want to expose technical IDs below the grid */}
          <div className="grid grid-cols-3 gap-[28px] mt-5">
            <Field id="profileId" label="Profile ID:" value={p?.profile_id} disabled readOnly />
            <Field id="urn" label="URN:" value={p?.urn} disabled readOnly />
            <Field id="userType" label="User Type:" value={(data as any)?.user_type ?? ''} disabled readOnly />
          </div>

          {/* (Optional) timestamps */}
          <div className="grid grid-cols-3 gap-[28px] mt-3">
            <Field id="createdAt" label="Created At:" value={p?.created_at} disabled readOnly />
            <Field id="updatedAt" label="Updated At:" value={p?.updated_at ?? ''} disabled readOnly />
            <Field
              id="verification"
              label="Verification:"
              value={`email:${p?.email_verified ? 'yes' : 'no'}, mobile:${p?.mobile_verified ? 'yes' : 'no'}, aadhaar:${p?.aadhaar_verified ? 'yes' : 'no'}, pan:${p?.pan_verified ? 'yes' : 'no'}`}
              disabled
              readOnly
            />
          </div>
        </div>
      </div>

      {/* (Optional) subtle loading state */}
      {isFetching ? (
        <div className="mt-3 text-xs text-gray-500">Refreshing profile…</div>
      ) : null}
    </div>
  );
};

export default ProfileDetailsTab;
