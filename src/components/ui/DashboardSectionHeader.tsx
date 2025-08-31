"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";

type DropdownItem = {
  key: string;
  label: React.ReactNode;
  path?: string;      // optional route to navigate on select
  disabled?: boolean;
};

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;

  /** Back behavior: priority -> onBack > backTo > router.back() */
  onBack?: () => void;
  backTo?: string;
  showBack?: boolean; // default true

  /** Optional right-side image (e.g., logo) */
  imgSrc?: string;
  imgAlt?: string;
  imgWidth?: number;   // default 110
  imgHeight?: number;  // default 26
  imgClassName?: string;

  /** Style hooks */
  containerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;

  /** Back arrow icon class */
  arrowClassName?: string;

  /** --- Optional Dropdown beside title --- */
  dropdownItems?: DropdownItem[];          // if provided, title becomes a dropdown trigger
  dropdownSelectedKey?: string;            // highlight active option
  onDropdownSelect?: (key: string) => void;
  dropdownPlacement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  dropdownClassName?: string;              // overlay class
  dropdownTriggerClassName?: string;       // trigger (title) wrapper class
  navigateOnDropdown?: boolean;            // default true: navigate if item has path
};

const DashboardSectionHeader: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  backTo,
  showBack = true,

  imgSrc,
  imgAlt = "brand",
  imgWidth = 110,
  imgHeight = 26,
  imgClassName,

  containerClassName,
  titleClassName,
  subtitleClassName,

  arrowClassName,

  dropdownItems,
  dropdownSelectedKey,
  onDropdownSelect,
  dropdownPlacement = "bottomLeft",
  dropdownClassName,
  dropdownTriggerClassName,
  navigateOnDropdown = true,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleBack = () => {
    if (onBack) return onBack();
    if (backTo) return router.push(backTo);
    router.back();
  };

  // Build antd menu from dropdownItems
  const menuItems: MenuProps["items"] | undefined = React.useMemo(() => {
    if (!dropdownItems?.length) return undefined;
    return dropdownItems.map((it) => ({
      key: it.key,
      label: it.label,
      disabled: it.disabled,
    }));
  }, [dropdownItems]);

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    const item = dropdownItems?.find((i) => i.key === key);
    if (navigateOnDropdown && item?.path) router.push(item.path);
    onDropdownSelect?.(String(key));
    setOpen(false);
  };

  const TitleBlock = (
    <div className="leading-tight">
      <div className={["text-base font-semibold text-gray-900", titleClassName || ""].join(" ")}>
        {title}
      </div>
      {subtitle && (
        <div className={["text-xs text-gray-500", subtitleClassName || ""].join(" ")}>
          {subtitle}
        </div>
      )}
    </div>
  );

  // If dropdown provided, wrap title with Dropdown trigger
  const TitleWithOptionalDropdown =
    dropdownItems && dropdownItems.length > 0 ? (
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={["click"]}
        placement={dropdownPlacement}
        overlayClassName={dropdownClassName}
        menu={{
          items: menuItems,
          onClick: onMenuClick,
          selectable: !!dropdownSelectedKey,
          selectedKeys: dropdownSelectedKey ? [dropdownSelectedKey] : [],
        }}
      >
        <Button
          type="text"
          className={[
            "group flex items-center gap-2 focus:outline-none",
            dropdownTriggerClassName || "",
          ].join(" ")}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {TitleBlock}
          {open ? (
            <UpOutlined className="!text-current !text-xl !translate-y-px" />
          ) : (
            <DownOutlined className="!text-current !text-xl !translate-y-px" />
          )}
        </Button>
      </Dropdown>
    ) : (
      TitleBlock
    );

  return (
    <div
      className={[
        "w-full bg-transparent rounded-xl px-4 py-2 flex items-center justify-between",
        containerClassName || "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            type="text"
            onClick={handleBack}
            aria-label="Back"
            className="inline-flex h-7 w-7 text-2xl items-center justify-center rounded-full text-gray-800 hover:bg-black/5"
          >
            <ArrowLeftOutlined className={arrowClassName} />
          </Button>
        )}
        {TitleWithOptionalDropdown}
      </div>

      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={imgWidth}
          height={imgHeight}
          className={["object-contain", imgClassName || ""].join(" ")}
          priority
        />
      ) : null}
    </div>
  );
};

export default DashboardSectionHeader;
