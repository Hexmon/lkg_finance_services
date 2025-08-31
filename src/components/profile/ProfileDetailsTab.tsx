'use client';

import React from 'react';

type FieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
};

const Field: React.FC<FieldProps> = ({ id, label, placeholder, className = '', type = 'text' }) => {
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
        className="block w-full h-9 rounded-md border border-[#E6E6E6] bg-white px-3 outline-none
                   focus:border-[#3B82F6] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.18)]
                   transition-colors"
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

/** pixel-tight layout to match screenshot */
const ProfileDetailsTab: React.FC = () => {
  return (
    <div className="w-full">
      <div
        className="grid"
        style={{
          gridTemplateColumns: '180px 1fr', // left profile block ~180px, form takes the rest
          columnGap: '28px',
        }}
      >
        {/* Left avatar/name */}
        <div className="min-h-[120px]">
          <ProfileBlock />
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
            <Field id="applicantName" label="Applicant Name:" />
            <Field id="fatherName" label="Father’s Name:" />
            <Field id="email" label="Email:" type="email" />

            <Field id="mobile" label="Mobile No.:" />
            <Field id="dob" label="Date Of Birth:" /* type="date" */ />
            <Field id="gender" label="Gender:" />

            <Field
              id="homeAddress"
              label="Home Address:"
              className="col-span-1"
            />
            <Field id="pincode" label="Pincode:" />
            <Field id="pan" label="Pan Card No.:" />

            <Field id="aadhaar" label="Aadhaar Card No.:" />
            <Field id="businessOutletName" label="Business Outlet Name:" />
            <Field id="businessOutletAddress" label="Business Outlet Address:" />

            <Field id="state" label="State:" />
            <Field id="district" label="District:" />
            <Field id="city" label="City:" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsTab;
