export const featureConfig = [
  {
    id: 1,
    title: "Total Transaction",
    icon: '/icons/total-transation.svg',
    quantity: "2,000",
    footer: "▲ 3.2% Since last month"
  },
  {
    id: 2,
    title: "Success Rate",
    icon: '/icons/success-rate.svg',
    quantity: "95.3%",
    footer: "▲ 3.2% Since last month"
  },
  {
    id: 3,
    title: "Customers",
    icon: '/icons/customer.svg',
    quantity: "1500",
    footer: "▲ 3.2% Since last month"
  },
  {
    id: 4,
    title: "Commissions",
    icon: '/icons/commission.svg',
    quantity: "1467",
    footer: "▲ 3.2% Since last month"
  },
]

export const quickService = [
  {
    id: 1,
    icon: "/icons/money-transfer.png",
    title: "Money Transfer",
    subtitle: "Send Money Instantly",
    navigationURL: "/money_transfer"
  },
  {
    id: 2,
    icon: "/icons/cash-withdraw.svg",
    title: "Cash Withdrawal",
    subtitle: "AEPS transactions",
    navigationURL: "/cash_withdrawal"
  },
  {
    id: 3,
    icon: "/icons/bill-payment.svg",
    title: "Bill Payment",
    subtitle: "Pay all bills",
    navigationURL: "/bill_payment"
  },
  {
    id: 4,
    icon: "/icons/cashfree-payment.svg",
    title: "Cashfree Payout",
    subtitle: "Bank transfers",
    navigationURL: "/cashfree_payout"
  },
]

export const walletData = [
  {
    label: "Main Wallet",
    amount: "₹ 25,000",
    icon: "/wallet.svg",
    growthIcon: "/thirteen.svg",
  },
  {
    label: "APES Wallet",
    amount: "₹ 8,500",
    icon: "/wallet.svg",
    growthIcon: "/thirteen.svg",
  },
  {
    label: "Commission",
    amount: "₹ 3,200",
    icon: "/wallet.svg",
    growthIcon: "/thirteen.svg",
  },
]

export const transactions = [
  { amount: 5000, name: "Rahul Sharma", type: "DMT", time: "2 min ago", status: "success" },
  { amount: 5000, name: "Rahul Sharma", type: "DMT", time: "2 min ago", status: "success" },
  { amount: 5000, name: "Rahul Sharma", type: "DMT", time: "2 min ago", status: "failed" },
  { amount: 5000, name: "Rahul Sharma", type: "DMT", time: "2 min ago", status: "processing" },
]

// src/config/app.config.ts
// Keep this file pure (no React imports)

export type WalletStat = {
  label: string;
  amount: string | number; // already formatted or raw (up to you)
  icon: string;
  growthIcon?: string;
};

export type WalletStatsInput = {
  totalTxnCount?: number | null;
  successRateRatio?: number | null;     // e.g., 99.5 (not 0.995)
  totalBeneficiaries?: number | null;   // replace when API available
  commissionOverall?: number | null;    // commissions.overal (as per your API)
};

/** ---------- Optional helpers (pure) ---------- */
const formatPercent = (n?: number | null) =>
  typeof n === "number" && !Number.isNaN(n) ? `${n}%` : "0%";

const formatNumber = (n?: number | null) =>
  typeof n === "number" && !Number.isNaN(n) ? n.toLocaleString("en-IN") : "0";

const formatINR = (n?: number | null) =>
  typeof n === "number" && !Number.isNaN(n)
    ? `₹${n.toLocaleString("en-IN")}`
    : "₹0";

/** ---------- Factory: build wallet stats from live data ---------- */
export function getWalletStats(input: WalletStatsInput): WalletStat[] {
  const {
    totalTxnCount,
    successRateRatio,
    totalBeneficiaries,
    commissionOverall,
  } = input;

  return [
    {
      label: "Total Transaction Count",
      amount: formatNumber(totalTxnCount),
      icon: "/heart-line.svg",
      growthIcon: "/icons/growth.svg",
    },
    {
      label: "Success Rate Ratio",
      amount: formatPercent(successRateRatio),
      icon: "/circle.svg",
      growthIcon: "/icons/growth.svg",
    },
    {
      label: "Total Beneficiaries",
      amount: formatNumber(totalBeneficiaries ?? 156), // TODO: replace with API when available
      icon: "/users.svg",
      growthIcon: "/icons/growth.svg",
    },
    {
      label: "Commission Earned",
      // if you prefer raw number, use formatNumber; for money, use formatINR:
      amount: formatINR(commissionOverall ?? 0),
      icon: "/star.svg",
      growthIcon: "/icons/growth.svg",
    },
  ];
}


export const services = [
  {
    key: "cash-withdrawal",
    label: "Cash Withdrawal",
    description: "Withdraw cash using Aadhaar",
    icon: "/cash-withdraw.svg",
    active: true,
  },
  {
    key: "balance-enquiry",
    label: "Balance Enquiry",
    description: "Check account balance",
    icon: "/balance-en.svg",
  },
  {
    key: "mini-statement",
    label: "Mini Statement",
    description: "Get last 5 transactions",
    icon: "/mini-stmt.svg",
  },
];

export const accounts = [
  {
    id: 1,
    name: "Rajesh Kumar",
    bank: "SBI",
    account: "*****1234",
    ifsc: "SBIFN89",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    bank: "SBI",
    account: "*****5678",
    ifsc: "SBIFN89",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    bank: "SBI",
    account: "*****9012",
    ifsc: "SBIFN89",
  },
];


// types
import type { Sender, Beneficiary } from "@/features/retailer/dmt/sender/domain/types";

// Helper to build a valid demo sender (uses route mobile_no if present)
const makeDemoSender = (mobileFromRoute?: string): Sender => ({
  sender_id: "8a1b7b3e-9c2f-4d3a-8f6b-2d1c5e7f9a01", // valid UUID v4
  sender_name: "Ravi Kumar",
  mobile_no: (mobileFromRoute && /^\d{10}$/.test(mobileFromRoute))
    ? mobileFromRoute
    : "9876543210",
  email_address: "ravi.kumar@example.com",
  pincode: "751001",
  beneficiary_count: 3,
});

// Demo beneficiaries (all valid per your Zod schema)
export const DEMO_BENEFICIARIES: Beneficiary[] = [
  {
    beneficiary_id: "a3fcb5d0-5f56-4a6e-9e62-0e7e3d1c2a90",
    lastfour: "4321",
    bankname: "HDFC Bank",
    b_name: "Anita Sharma",
    b_mobile: "9876501234",
    status: "ACTIVE",
  },
  {
    beneficiary_id: "c7b4b1a2-3d44-4e8f-9a77-21a6c3f4b5d2",
    lastfour: "1188",
    bankname: "State Bank of India",
    b_name: "Suresh Patnaik",
    b_mobile: "9696969696",
    status: "ACTIVE",
  },
  {
    beneficiary_id: "f2e1c0d9-8b76-4a23-9c45-6e5a4d3c2b10",
    lastfour: "0072",
    bankname: "ICICI Bank",
    b_name: "Priya Das",
    b_mobile: "9012345678",
    status: "VERIFIED",
  },
];

// Exported helper to compute UI-safe values
export const getUiSenderAndBeneficiaries = (
  senderFromApi: Sender | undefined,
  beneficiariesFromApi: Beneficiary[] | undefined,
  mobileFromRoute?: string
) => {
  const uiSender: Sender =
    senderFromApi ?? makeDemoSender(mobileFromRoute);

  const uiBeneficiaries: Beneficiary[] =
    (beneficiariesFromApi && beneficiariesFromApi.length > 0)
      ? beneficiariesFromApi
      : DEMO_BENEFICIARIES;

  return { uiSender, uiBeneficiaries };
};
