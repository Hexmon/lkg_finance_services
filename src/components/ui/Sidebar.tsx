'use client';

import React from 'react';
import { Layout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Sider } = Layout;

export type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  path?: string;
};

export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

type LogoProp =
  | string
  | { full: string; compact?: string; alt?: string; blurDataURL?: string };

export type SidebarProps = {
  logo?: LogoProp;
  sections: SidebarSection[];
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: (path: string) => void;
  activePath?: string;
  width?: number;           // default 224
  collapsedWidth?: number;  // default 64
};

function toMenuItems(sections: SidebarSection[]): MenuProps['items'] {
  const items: MenuProps['items'] = [];
  sections.forEach((sec, sIdx) => {
    if (sec.title) {
      items.push({
        type: 'group',
        key: `group-${sIdx}`,
        label: (
          <span className="text-[11px] tracking-wide text-gray-300 uppercase">
            {sec.title}
          </span>
        ),
      });
    }
    sec.items.forEach((it, iIdx) => {
      items.push({ key: it.path ?? `${sIdx}-${iIdx}`, icon: it.icon, label: it.label });
    });
  });
  return items;
}

const Sidebar: React.FC<SidebarProps> = ({
  logo,
  sections,
  collapsed,
  onToggle,
  onNavigate,
  activePath,
  width = 224,
  collapsedWidth = 64,
}) => {
  const items = React.useMemo(() => toMenuItems(sections), [sections]);

  // normalize logo prop
  const fullLogo =
    typeof logo === 'string' ? logo : logo?.full ?? '/logo.png';
  const compactLogo =
    typeof logo === 'string' ? logo : logo?.compact ?? fullLogo;
  const altText = typeof logo === 'string' ? 'Logo' : logo?.alt ?? 'Logo';
  const blurDataURL = typeof logo === 'string' ? undefined : logo?.blurDataURL;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={width}
      collapsedWidth={collapsedWidth}
      breakpoint="lg"
      className="!bg-[#174c96] rounded-xl"
      style={{
        transition: 'width 220ms ease',
        height: '99vh',
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo (Next/Image) */}
      <div className="flex items-center justify-center px-3 pt-3 pb-4 border-b border-white/10">
        <div
          className="relative"
          style={{
            width: collapsed ? 32 : 120,  // match your design
            height: collapsed ? 32 : 32,
            transition: 'width 200ms ease, opacity 200ms ease',
          }}
        >
          <Image
            src={collapsed ? compactLogo : fullLogo}
            alt={altText}
            className='size-full'
            fill
            sizes={collapsed ? '32px' : '120px'}
            style={{ objectFit: 'contain' }}
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
            priority
          />
        </div>
      </div>

      <Menu
        mode="inline"
        items={items}
        onClick={(info) => onNavigate?.(info.key as string)}
        selectedKeys={activePath ? [activePath] : []}
        className="!bg-transparent !text-white [&_.ant-menu-item]:!text-white
                   [&_.ant-menu-item-selected]:!bg-white/15
                   [&_.ant-menu-item-selected]:!text-white
                   [&_.ant-menu-item-icon]:!text-white
                   px-2 pt-3"
      />

      <div className="absolute bottom-3 left-0 w-full px-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="!text-white !w-full !h-9 hover:!bg-white/10"
        >
          {!collapsed && 'Collapse'}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
