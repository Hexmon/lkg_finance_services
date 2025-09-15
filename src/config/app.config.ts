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

export const biometricString = "PD94bWwgdmVyc2lvbj0iMS4wIj8+PFBpZERhdGE+CiAgPFJlc3AgZXJyQ29kZT0iMCIgZXJySW5mbz0iU3VjY2Vzcy4iIGZDb3VudD0iMSIgZlR5cGU9IjAiIG5tUG9pbnRzPSIzMCIgcVNjb3JlPSI3MSIvPgogIDxEZXZpY2VJbmZvIGRwSWQ9Ik1BTlRSQS5NU0lQTCIgcmRzSWQ9Ik1BTlRSQS5XSU4uMDAxIiByZHNWZXI9IjEuMC44IiBtaT0iTUZTMTAwIiBtYz0iTUlJRUZ6Q0NBditnQXdJQkFnSURXNDJBTUEwR0NTcUdTSWIzRFFFQkN3VUFNSUhxTVNvd0tBWURWUVFERXlGRVV5Qk5RVTVVVWtFZ1UwOUdWRVZEU0NCSlRrUkpRU0JRVmxRZ1RGUkVJRE14VlRCVEJnTlZCRE1UVEVJdE1qQXpJRk5vWVhCaGRHZ2dTR1Y0WVNCUGNIQnZjMmwwWlNCSGRXcGhjbUYwSUVocFoyZ2dRMjkxY25RZ1V5NUhJRWhwWjJoM1lYa2dRV2h0WldSaFltRmtJQzB6T0RBd05qQXhFakFRQmdOVkJBa1RDVUZJVFVWRVFVSkJSREVRTUE0R0ExVUVDQk1IUjFWS1FWSkJWREVMTUFrR0ExVUVDeE1DU1ZReEpUQWpCZ05WQkFvVEhFMUJUbFJTUVNCVFQwWlVSVU5JSUVsT1JFbEJJRkJXVkNCTVZFUXhDekFKQmdOVkJBWVRBa2xPTUI0WERUSTFNRGt4TURFeU5Ea3dPRm9YRFRJMU1UQXhNREV6TURRd05sb3dnYkF4SlRBakJnTlZCQU1USEUxaGJuUnlZU0JUYjJaMFpXTm9JRWx1WkdsaElGQjJkQ0JNZEdReEhqQWNCZ05WQkFzVEZVSnBiMjFsZEhKcFl5Qk5ZVzUxWm1GamRIVnlaVEVPTUF3R0ExVUVDaE1GVFZOSlVFd3hFakFRQmdOVkJBY1RDVUZJVFVWRVFVSkJSREVRTUE0R0ExVUVDQk1IUjFWS1FWSkJWREVMTUFrR0ExVUVCaE1DU1U0eEpEQWlCZ2txaGtpRzl3MEJDUUVXRlhOMWNIQnZjblJBYldGdWRISmhkR1ZqTG1OdmJUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUtOb0RiUmh3YTBmazFGK2lOTzFDbkVvTUY3dkJTSHRtbVhPY1pPcmZnU0RkRnR1YkQ2aTlsbmNPNlZmQzR3dTc0OUUzR2JRRGd5bGU4R3cyb01zR0lWUGJJVnpZZ2xkcjJSNytnQ1E1d245N2ErTk1Nc2xmM3JsNTFkcVlNUGttaEh1U1JuMFE5MFdIcG1EMFRWcnlVRHdKS3RpN2ZZRlYzbEdkNzFWeEYwd0dmdUg5QUZVT2lBa2I4QVJnM1VTRFJFaWFjNXh3Y0VBWjFxamNIOWlmSFQzcFRlY2FXbjM4Z1MydzE2QXZKNnBjakxGc1U5dklkWHBSWXFhU1VaVHIvdEN2MVp4NkEzSStWdFdZc2lXbjRiV1JZekIzc25QUlNkUmswUjAvY0g1eGtxWFBjL1NVUzJyb2dLaTF6MExSSEErYnZQck90S1k3L0JrZEFjUjMwTUNBd0VBQVRBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQW9kVEJ0UjZZaUdQeEdGVmJ2OXc3K3NnR0c2WTduVWFzMUJqKzMyMGZVbCt5QTBkQmI4Tys0NmF1eFVDQ0JSa0VUK21XalN1eVVvRTE2elpiL1hubVZuenFBM2pGdGNGbGVOcTdkZ2NjVHNaOVpNajBHWGRtZFYvRGVBY1dtbE1qK1JwaVVqdjJ5azUyanJxc0dZdDBHT1ZacWZiOTRGZmVYR2tGSmVrUTBjQWx2YjdTRzBrVlhhUzVzbnRVa3ZreVRGdzU0L21IS3Z2RzEycFNOZmJnWmI0NnRwRmdwaTV5TGkyb0ZTUUtJemNXendTNWhTTVd2MFptbmJOR3NvTGtyRit5VW41aVBkay9OUjUzNmhZbmw2QnZ2dldLQmZ5NmUvMnkydloxd043VGp1blJaT0dDZEFGYlRvTjNSYVY3MHJtZ1I1dWtVMFBva3VORmVaTFkyQT09IiBkYz0iYWEyMTc4MzUtOGQzNy00NmZlLWJhYzMtM2Q5NjhkZDdhZjM2Ij4KICAgIDxhZGRpdGlvbmFsX2luZm8+CiAgICAgIDxQYXJhbSBuYW1lPSJzcm5vIiB2YWx1ZT0iNTc2MjI2OSIvPgogICAgICA8UGFyYW0gbmFtZT0ic3lzaWQiIHZhbHVlPSI2RTlGRUJGNkExRDE1NkVGQkZGMCIvPgogICAgICA8UGFyYW0gbmFtZT0idHMiIHZhbHVlPSIyMDI1LTA5LTEwVDE4OjU2OjEwKzA1OjMwIi8+CiAgICA8L2FkZGl0aW9uYWxfaW5mbz4KICA8L0RldmljZUluZm8+CiAgPFNrZXkgY2k9IjIwMjUwOTIzIj5NZURicWo3Znl5OEg0cEdOQlVGOUVNelpsdGRHWFRtVHZMQ0tZZlFiT1M3Y2RYK0lCek0wbjh1TUdYWFN2ck1PNVVESlp1YnRtUUgwNEdzS3B6K1gvNlZmL2ZTd2dYNFVSbEZjUEZIdWlmbCt4Y3gxYmZiUEFPVWNKVWhyNjhFa2tkQ2d0ay91U0YybzBZY2orc2ZMU2IwSkxtSTMrWE9qa2J0bkp6TUQwTFBHVlFISURTR2RVZm9nR1VHTDBQVzl1Z3BUYm5EQ3E5REp3SktOalJUbVE0VTZkSUFLVzVPWk1PTmxydzZ2Z1Y5aG5PNktOOG8wa3djU0NTNUpxMG9MRkxYUnVML09SZ0RJOWw0U1FVY3c5ZG9EeVZWZjg5MFM2bXBUMmhvZFhuWHV6eGNqRk92dEo5dDVyaTAyUzd0SUhNK1lsNnVXdk9US1NSWFBuZS9xYlE9PTwvU2tleT4KICA8SG1hYz4rN21ZekNSZ0J0TG1uYUNmZU5BVmdqbXl5eDJaWFdIQTBZNzV4NE9yQmhEalNLakFIYU9BeURyZ0lpanNVczI5PC9IbWFjPgogIDxEYXRhIHR5cGU9IlgiPk1qQXlOUzB3T1MweE1GUXhPRG8xTmpveE5DOE41Z3pJUytla2ttV0kxY0JSeVRyVyt3VnNVT3FzMHVoVTJRYWVmVkhnZjZNUHFlSVN0N1VIT3FuWkJWNWQrOEtuOXZXNnRIWU56SFVoRVF6VDNCZTFrOGNYMC9nS0UrNjc3ZmRXODZnRFFxamZsVjRLVXY0R1NydVNxV0VGVFY5SDgvSGZRVVNxODBrZ0dTSkdiaEc0TWNUT2ZDUExGamhYRjFNeGFtb2l4dUVVSUJ1Qk50NHVGZGJUdjdLVThNK3B2ZzJSZDRtTE9KSTNrazVSaUE2KzNkUDhlTnFXL2VFQkt2VlJ0TlRDMFJyMGJQcmFEdStMbmI3QmUyZCsvOVZnSmV4MlYrM3F3Vlg5cXlOdTBsc0ZsTUN1NEptYlk3anZVUTBpRXZJc0MzZVdFT1ZybHRnVnJBcjkvZW1NM1hIdGdUR1hKL3NZY0NxVzJlekdRM2hDVTVCUVlWaXhrS3Vna0gxa0JkYWd2bnVvNlN6Rksza1ZXRWVTcG9VdTI0c0dXRVlqclllY0JmanlYT0tRZnJ5aEh2ZU5vWnVZdDk2RnRlaERqaVZLbmNDTW11WDk1SjhPRW1GY3JYd2wvNlI3YURnK2pDNThSU1pkS0prczlqNkcwbythK0xCcFpvNk1kRlJOeGh4WS83M1VZUEQza3JuaEpjQm5naURRN3NaSXVJZjZPWUExeU80ZGdjUFRRd2x3WXBGVWpCcDdBSWdscnEzOFg3NlluOU5lME5GZk1TRnVvRklzcXVXK1VWbnRnM1RxbXBmVVplRUNQWWJ0TzZtNUl5aGRMYW5oWDNrUmMwZFF2QTVwbTYySnd2RHYwaDlTZHp3MjEwNkh6TVB6a2xLTmpKNlVJM3ZGbTR1Z0l0RUUrUXI2SEVxTVlQWkpldGFwL0h2MXhPREI5Z0hkUGFwa0ZMYnNZOE1uZWU1bXdadUxSaFV0cU16UWxwblJjTFNRNlkycDVDeUpLSlBGMnFJdFZPUk1oL0U5QmE3TXhDQlgxSUZadDdlR0pWZHVJR0hJbUwzT2JUQ3FNelYxSWJKaXgwNXVVM2o2OFdBUVZwVWJPcHVISkhYRXl5TU5QWlIxNGdSSStaTkZIbWpKaElGeDExZUo1L0R6dW5lNUtQNzZpNlFyTU9xcVg4VU5OQVJ0QzFUM1FlaisvTCtSa3FDMUhqNlh5UWo1eGxucEdYRkdPU2U3cGthTi9RQkZCQkg2N3VpcFFnUVlBcW1mRW9XY21rZjNaTGg2Y25sbDdsOXJBUFc0YU84Y1NaKzluUWh5ekRheXZrandIekFFb21UREh6cWI3ckxuQnMrR3hWTjVYQVdGQ1dhOWEzUGNZVFdsRDloaEJIZW45Y1RvUDkzK1VSRy9KVHhwdHRhaEhQcmUzb1g0NnVBRnRSTFJEbEFjTXhJSkwxUkpMYVRCSHh4eGhTRGNkbmVhWXBYYit4K2FMZFVUNGY2eGJ3PT08L0RhdGE+CjwvUGlkRGF0YT4="