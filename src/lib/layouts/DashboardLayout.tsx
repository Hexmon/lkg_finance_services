'use client';

import React from 'react';
import { Layout, Spin } from 'antd';

import Sidebar, { SidebarSection } from '@/components/ui/Sidebar';
import Topbar from '@/components/ui/Topbar';

const { Content } = Layout;

type Props = { children: React.ReactNode; activePath?: string, sections: SidebarSection[], pageTitle: string, isLoading?: boolean };

export default function DashboardLayout({ children, activePath = '/dashboard', sections, pageTitle, isLoading }: Props) {
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
            title={pageTitle ?? ""}
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
        <Content className="overflow-y-auto p-4 !bg-[#ececec] sm:p-6">
          {
            isLoading ? (
              <Spin size="large" tip="Loading..." fullscreen />
            ) : (
              children
            )
          }
        </Content>
      </Layout>
    </Layout>
  );
}
