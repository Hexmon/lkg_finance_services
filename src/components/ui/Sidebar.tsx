'use client';

import React from 'react';
import { Layout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const { Sider } = Layout;

export type SidebarItem = {
  label: string;
  icon: React.ReactNode | string;
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
  onNavigate?: (path: string) => void; // optional external navigation
  /** activePath is now optional; if omitted, we use usePathname() */
  activePath?: string;
  width?: number;
  collapsedWidth?: number;
};

// ---- Helpers ----
function renderIcon(icon: React.ReactNode | string) {
  if (typeof icon === 'string') {
    return (
      <Image
        src={icon}
        alt="menu-icon"
        width={20}
        height={20}
        className="object-contain"
        priority
      />
    );
  }
  return icon;
}

function flattenItemPaths(sections: SidebarSection[]): string[] {
  const paths: string[] = [];
  sections.forEach((sec) =>
    sec.items.forEach((it) => {
      if (it.path) paths.push(it.path);
    })
  );
  return paths;
}

/** Find the item whose path is the longest prefix of currentPath */
function getBestMatchKey(allPaths: string[], currentPath: string): string | undefined {
  if (!currentPath) return undefined;
  let best: string | undefined;
  let bestLen = -1;
  for (const p of allPaths) {
    if (currentPath === p || currentPath.startsWith(p + '/')) {
      if (p.length > bestLen) {
        best = p;
        bestLen = p.length;
      }
    }
  }
  // also handle exact root matches like "/bbps"
  if (!best && allPaths.includes(currentPath)) return currentPath;
  return best;
}

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
      const key = it.path ?? `noop-${sIdx}-${iIdx}`; // non-path key for items without path
      items.push({
        key,
        icon: renderIcon(it.icon),
        label: it.label,
        disabled: !it.path, // prevent clicks when path missing
      });
    });
  });
  return items;
}

const Sidebar: React.FC<SidebarProps> = ({
  logo,
  sections,
  collapsed,
  // onToggle,
  onNavigate,
  activePath, // optional now
  width = 224,
  collapsedWidth = 64,
}) => {
  const router = useRouter();
  const pathname = usePathname(); // current URL
  const items = React.useMemo(() => toMenuItems(sections), [sections]);

  // compute selected key robustly:
  const allPaths = React.useMemo(() => flattenItemPaths(sections), [sections]);
  const currentPath = activePath ?? pathname ?? '';
  const selectedKey = React.useMemo(
    () => getBestMatchKey(allPaths, currentPath) ?? '',
    [allPaths, currentPath]
  );

  // normalize logo prop
  const fullLogo = typeof logo === 'string' ? logo : logo?.full ?? '/logo.png';
  const compactLogo = typeof logo === 'string' ? logo : logo?.compact ?? fullLogo;
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
      {/* Logo */}
      <div className="flex items-center justify-center px-3 pt-3 pb-4 border-b border-white/10">
        <div
          className="relative"
          style={{
            width: collapsed ? 32 : 120,
            height: 32,
            transition: 'width 200ms ease, opacity 200ms ease',
          }}
        >
          <Image
            src={collapsed ? compactLogo : fullLogo}
            alt={altText}
            className="size-full"
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
        selectedKeys={selectedKey ? [selectedKey] : []}
        onClick={(info) => {
          const key = String(info.key);

          // 1) Always navigate if it's a URL-like key
          if (key.startsWith('/')) {
            router.push(key);
          } else {
            // Optional: helpful during dev
            // console.warn('Clicked non-route menu item:', key);
          }

          // 2) Still notify parent if provided
          if (onNavigate) onNavigate(key);
        }}
        className="!bg-transparent !text-white
             [&_.ant-menu-item]:!text-white
             [&_.ant-menu-item-selected]:!bg-white/15
             [&_.ant-menu-item-selected]:!text-white
             [&_.ant-menu-item-icon]:!text-white
             px-2 pt-3"
      />


      <div className="absolute bottom-3 left-0 w-full px-2 space-y-1">
        <Button
          type="text"
          className="!text-white !w-full !h-9 hover:!bg-white/10"
        >
          FAQ
        </Button>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          className="!text-white !w-full !h-9 hover:!bg-white/10"
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;




// <div className="absolute bottom-3 left-0 w-full px-2">
//   <Button
//     type="text"
//     // icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//     // onClick={onToggle}
//     className="!text-white !w-full !h-9 hover:!bg-white/10"
//   >
//     FAQ
//   </Button>
//   <Button
//     type="text"
//     icon={<LogoutOutlined />}
//     // onClick={onToggle}
//     className="!text-white !w-full !h-9 hover:!bg-white/10"
//   >
//     Logout
//   </Button>
//   {/* <Button
//     type="text"
//     icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//     onClick={onToggle}
//     className="!text-white !w-full !h-9 hover:!bg-white/10"
//   >
//     {!collapsed}
//   </Button> */}
// </div>