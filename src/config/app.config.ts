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

export const walletStats = [
  {
    label: "Today's Transfer",
    amount: "₹2,45,000",
    icon: "/heart-line.svg",
    growthIcon: "/icons/growth.svg", 
  },
  {
    label: "Success Rate",
    amount: "99.5%",
    icon: "/circle.svg",
    growthIcon: "/icons/growth.svg",
  },
  {
    label: "Total Beneficiaries",
    amount: "156",
    icon: "/users.svg",
    growthIcon: "/icons/growth.svg",
  },
  {
    label: "Commission Earned",
    amount: "₹1,240",
    icon: "/star.svg",
    growthIcon: "/icons/growth.svg"
  },
]

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
