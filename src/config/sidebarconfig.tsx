import { SidebarSection } from "@/components/ui/Sidebar";

export const dashboardSidebarConfig: SidebarSection[] = [
  {
    title: 'Retailer',
    items: [{ label: 'Dashboard', icon: "/sidebar-icons/home.png", path: '/' }],
  },
  {
    title: 'Services',
    items: [
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money-transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash-withdraw' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bbps' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Support Ticket', icon: "/sidebar-icons/pan-card.png", path: '/pancard' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: "/sidebar-icons/report-management.png", path: '/reports' }],
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
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money-transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash-withdraw' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bbps' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Support Ticket', icon: "/sidebar-icons/pan-card.png", path: '/pancard' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: "/sidebar-icons/report-management.png", path: '/reports' }],
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
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money-transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash-withdraw' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bbps' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Pan Card', icon: "/sidebar-icons/pan-card.png", path: '/pancard' },
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
      { label: 'Money Transfer', icon: "/sidebar-icons/money-transfer.svg", path: '/money-transfer' },
      { label: 'Cash Withdrawal', icon: "/sidebar-icons/cash-withdraw.png", path: '/cash-withdraw' },
      { label: 'Bill Payment', icon: "/sidebar-icons/bill-payment.png", path: '/bbps' },
      { label: 'Fastag', icon: "/sidebar-icons/fastag.png", path: '/fastag' },
      { label: 'Support Ticket', icon: "/sidebar-icons/pan-card.png", path: '/pancard' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: "/sidebar-icons/report-management.png", path: '/reports' }],
  },
];