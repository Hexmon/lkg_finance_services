'use client';

import React from 'react';
import { Alert, Layout, Spin } from 'antd';

import Sidebar, { SidebarSection } from '@/components/ui/Sidebar';
import Topbar from '@/components/ui/Topbar';
import { ApiError } from '@/features/retailer/client';

const { Content } = Layout;

type Props = { children: React.ReactNode; activePath?: string, sections: SidebarSection[], pageTitle: string, isLoading?: boolean, error?: unknown | unknown[]; };

function getErrorMessage(e: unknown): string {
  if (!e) return "";

  // Our custom ApiError
  if (e instanceof ApiError) {
    if (typeof e.data === "string") return e.data;
    if (e.data && typeof e.data === "object") {
      const d = e.data as Record<string, unknown>;
      if (typeof d.message === "string") return d.message;
      if (d.error && typeof (d.error as any).message === "string") {
        return (d.error as any).message;
      }
    }
    return e.message;
  }

  // Generic Error
  if (e instanceof Error) return e.message;

  // Fallback
  return String(e);
}

export default function DashboardLayout({ children, activePath = '/dashboard', sections, pageTitle, isLoading, error }: Props) {
  const [collapsed, setCollapsed] = React.useState(false);

  const errors: unknown[] = React.useMemo(() => {
    if (!error) return [];
    return Array.isArray(error) ? error.filter(Boolean) : [error];
  }, [error]);

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
            onAddFunds={() => console.log('Add Funds')}
            onDebitFunds={() => console.log('Debit Funds')}
          />
        </div>
        <Content className="overflow-y-auto p-4 !bg-[#ececec] sm:p-6">
          {isLoading ? (
            <Spin size="large" tip="Loading..." fullscreen />
          ) : errors.length > 0 ? (
            <div className="space-y-3">
              {errors.map((e, i) => (
                <Alert
                  key={i}
                  type="error"
                  message="Something went wrong"
                  description={getErrorMessage(e)}
                  showIcon
                />
              ))}
            </div>
          ) : (
            children
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
