import { SidebarSection } from "@/components/ui/Sidebar";

export const dashboardSidebarConfig: SidebarSection[] = [
  {
    title: 'Retailer',
    items: [{ label: 'Dashboard', icon: "/sidebar-icons/home.png", path: '/' }],
  },
  {
    title: 'Services',
    items: [
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money_transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash_withdrawal' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bill_payment' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Support Ticket', icon: "/sidebar-icons/pan-card.png", path: '/support_ticket' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: "/sidebar-icons/report-management.png", path: '/reports_analysis' }],
  },
];

export const moneyTransferSidebarConfig: SidebarSection[] = [
  {
    title: 'Retailer',
    items: [{ label: 'Dashboard', icon: "/sidebar-icons/home.png", path: '/' }],
  },
  {
    title: 'Services',
    items: [
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money_transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash_withdrawal' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bill_payment' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Support Ticket', icon: "/sidebar-icons/pan-card.png", path: '/support_ticket' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: "/sidebar-icons/report-management.png", path: '/reports_analysis' }],
  },
];

export const cashWithdrawSidebarConfig: SidebarSection[] = [
  {
    title: 'Retailer',
    items: [{ label: 'Dashboard', icon: "/sidebar-icons/home.png", path: '/' }],
  },
  {
    title: 'Services',
    items: [
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money_transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash_withdrawal' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bill_payment' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Pan Card', icon: "/sidebar-icons/pan-card.png", path: '/support_ticket' },
    ],
  },
];


export const billPaymentSidebarConfig: SidebarSection[] = [
  {
    title: 'Retailer',
    items: [{ label: 'Dashboard', icon: "/sidebar-icons/home.png", path: '/' }],
  },
  {
    title: 'Services',
    items: [
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money_transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash_withdrawal' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bill_payment' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Support Ticket', icon: "/sidebar-icons/pan-card.png", path: '/support_ticket' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: "/sidebar-icons/report-management.png", path: '/reports_analysis' }],
  },
];