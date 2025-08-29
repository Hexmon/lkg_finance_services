'use client';

import React from 'react';
import { Layout } from 'antd';
import {
  BarChartOutlined,
  CarOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  HomeOutlined,
  IdcardOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';

import Sidebar, { SidebarSection } from '@/components/ui/Sidebar';
import Topbar from '@/components/ui/Topbar';

const { Content } = Layout;

const sections: SidebarSection[] = [
  {
    title: 'Retailer',
    items: [{ label: 'Dashboard', icon: <HomeOutlined />, path: '/bbps' }],
  },
  {
    title: 'Services',
    items: [
      { label: 'Money Transfer', icon: <SwapOutlined />, path: '/money-transfer' },
      { label: 'Cash Withdrawal', icon: <CreditCardOutlined />, path: '/cash-withdrawal' },
      { label: 'Bill Payment', icon: <FileTextOutlined />, path: '/bill-payment' },
      { label: 'Fastag', icon: <CarOutlined />, path: '/fastag' },
      { label: 'Pan card', icon: <IdcardOutlined />, path: '/pancard' },
    ],
  },
  {
    title: 'Reports',
    items: [{ label: 'Report & Analytics', icon: <BarChartOutlined />, path: '/reports' }],
  },
  {
    title: '',
    items: [
      { label: 'FAQ', icon: <QuestionCircleOutlined />, path: '/faq' },
      { label: 'Logout', icon: <LogoutOutlined />, path: '/logout' },
    ],
  },
];

type Props = { children: React.ReactNode; activePath?: string };

export default function DashboardLayout({ children, activePath = '/dashboard' }: Props) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout className="h-screen bg-slate-50 overflow-hidden p-1">
      {/* Sidebar (sticky inside the app frame) */}
      <Sidebar
        logo="/logo.png"
        sections={sections}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onNavigate={(path) => console.log('Navigate to:', path)}
        activePath={activePath}
      />

      {/* Right Pane (scroll container) */}
      <Layout className="min-w-0 h-full">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-20 backdrop-blur m-1">
          <Topbar
            title="Dashboards"
            balance={25000}
            onAddFunds={() => console.log('Add Funds')}
            onDebitFunds={() => console.log('Debit Funds')}
            notifications={0}
            user={{
              name: 'Rajesh Saini',
              id: 'R047040',
              role: 'Retailer',
              avatarUrl: 'https://i.pravatar.cc/100?img=5',
              verified: true,
            }}
          />
        </div>

        {/* Scrollable content */}
        <Content className="overflow-y-auto p-4 sm:p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
