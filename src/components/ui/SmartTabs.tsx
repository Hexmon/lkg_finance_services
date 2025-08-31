'use client';

import React, {
  KeyboardEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Key = string | number;

export type TabItem = {
  /** unique key (string or number) */
  key: Key;
  /** anything for the tab header (text, icon, badges, custom JSX) */
  label: React.ReactNode;
  /** tab panel body (any JSX) */
  content: React.ReactNode;
  disabled?: boolean;
  /** extra header classes */
  className?: string;
  /** extra panel classes */
  panelClassName?: string;
};

export type SmartTabsProps = {
  items: TabItem[];
  /** controlled active key */
  activeKey?: Key;
  /** uncontrolled initial key */
  defaultActiveKey?: Key;
  /** change callback */
  onChange?: (key: Key) => void;
  /** right-side header area (e.g., Add button) */
  extra?: React.ReactNode;
  /** stretch headers to fill the row */
  fitted?: boolean;
  /** keep panels mounted (helpful for forms) */
  keepAlive?: boolean;
  /** wrapper classes */
  className?: string;
  /** tablist classes */
  tablistClassName?: string;
  /** panels wrapper classes */
  panelsClassName?: string;
  /** animation timing (ms) */
  durationMs?: number; // default 240
  /** CSS timing function */
  easing?: string; // default 'cubic-bezier(.22,1,.36,1)'
};

export function SmartTabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  extra,
  fitted = false,
  keepAlive = true,
  className = '',
  tablistClassName = '',
  panelsClassName = '',
  durationMs = 240,
  easing = 'cubic-bezier(.22,1,.36,1)',
}: SmartTabsProps) {
  const reactId = useId();
  const isControlled = activeKey !== undefined;

  const firstEnabledKey = useMemo(
    () => items.find((t) => !t.disabled)?.key,
    [items]
  );

  const [internalKey, setInternalKey] = useState<Key | undefined>(
    defaultActiveKey ?? firstEnabledKey
  );
  const currentKey = (isControlled ? activeKey : internalKey) as Key;

  /** when active changes, keep previous key briefly for a smooth leave animation */
  const prevKeyRef = useRef<Key>(currentKey);
  const [prevKey, setPrevKey] = useState<Key | null>(null);

  useEffect(() => {
    if (prevKeyRef.current !== currentKey) {
      setPrevKey(prevKeyRef.current);
      prevKeyRef.current = currentKey;
      const t = setTimeout(() => setPrevKey(null), durationMs);
      return () => clearTimeout(t);
    }
  }, [currentKey, durationMs]);

  // If items change and current is gone/disabled -> fallback
  useEffect(() => {
    const ok = items.some((i) => i.key === currentKey && !i.disabled);
    if (!ok) {
      const fb = firstEnabledKey;
      if (!isControlled) setInternalKey(fb);
      onChange?.(fb as Key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const setActive = (key: Key) => {
    if (items.find((i) => i.key === key)?.disabled) return;
    if (!isControlled) setInternalKey(key);
    onChange?.(key);
  };

  /** roving focus + keyboard nav */
  const headersRef = useRef<(HTMLButtonElement | null)[]>([]);
  headersRef.current = [];
  const registerHeader = (el: HTMLButtonElement | null) => {
    if (el && !headersRef.current.includes(el)) headersRef.current.push(el);
  };

  const currentIndex = useMemo(
    () => items.findIndex((i) => i.key === currentKey),
    [items, currentKey]
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const enabledIdx = items
      .map((t, i) => (t.disabled ? -1 : i))
      .filter((i) => i !== -1);
    const pos = enabledIdx.indexOf(currentIndex);
    if (pos < 0) return;

    if (e.key === 'ArrowRight') {
      const next = enabledIdx[(pos + 1) % enabledIdx.length];
      setActive(items[next].key);
      headersRef.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev =
        enabledIdx[(pos - 1 + enabledIdx.length) % enabledIdx.length];
      setActive(items[prev].key);
      headersRef.current[prev]?.focus();
    } else if (e.key === 'Home') {
      const first = enabledIdx[0];
      setActive(items[first].key);
      headersRef.current[first]?.focus();
    } else if (e.key === 'End') {
      const last = enabledIdx[enabledIdx.length - 1];
      setActive(items[last].key);
      headersRef.current[last]?.focus();
    }
  };

  /** animated underline “ink” bar */
  const barRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const activeEl = headersRef.current[currentIndex];
    const bar = barRef.current;
    if (!activeEl || !bar) return;
    const { offsetLeft, offsetWidth } = activeEl;
    bar.style.transition = `transform ${durationMs}ms ${easing}, width ${durationMs}ms ${easing}`;
    bar.style.transform = `translateX(${offsetLeft}px)`;
    bar.style.width = `${offsetWidth}px`;
  }, [currentIndex, items, durationMs, easing]);

  /** shared transition classes */
  const transitionCls =
    'transition-all will-change-transform will-change-opacity';
  const leaveCls = 'opacity-0 -translate-y-1';   // fade up
  const enterCls = 'opacity-100 translate-y-0';  // final state

  return (
    <div className={`w-full ${className}`}>
      {/* TABLIST */}
      <div className="flex items-center justify-between">
        <div
          role="tablist"
          aria-orientation="horizontal"
          className={`relative flex gap-1 overflow-x-auto no-scrollbar ${tablistClassName} ${
            fitted ? 'justify-between' : ''
          }`}
          onKeyDown={onKeyDown}
        >
          {items.map((tab) => {
            const selected = tab.key === currentKey;
            return (
              <button
                key={String(tab.key)}
                ref={registerHeader}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${reactId}-panel-${tab.key}`}
                id={`${reactId}-tab-${tab.key}`}
                disabled={!!tab.disabled}
                onClick={() => setActive(tab.key)}
                className={[
                  'relative inline-flex items-center gap-2 rounded-md',
                  'px-3.5 py-2.5 text-sm md:text-base',
                  'text-gray-600 hover:text-gray-800',
                  'transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                  fitted ? 'grow justify-center' : '',
                  selected ? 'text-blue-700' : '',
                  tab.className ?? '',
                ].join(' ')}
                style={{ transitionTimingFunction: easing }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {tab.label}
              </button>
            );
          })}

          {/* underline slider */}
          <div
            aria-hidden
            ref={barRef}
            className="pointer-events-none absolute bottom-0 h-[2px] bg-blue-600"
            style={{ width: 0, transform: 'translateX(0px)' }}
          />
        </div>

        {extra && (
          <div className="ml-3 shrink-0">
            {/* smooth hover/press for the extra area (e.g., AntD button) */}
            <div className="transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0">
              {extra}
            </div>
          </div>
        )}
      </div>

      {/* PANELS */}
      <div className={`relative mt-4 ${panelsClassName}`}>
        {items.map((tab) => {
          const isCurrent = tab.key === currentKey;
          const isLeaving = prevKey !== null && tab.key === prevKey;

          // mount strategy:
          // - if keepAlive: keep everything mounted but hide others (except prev) for animation
          // - else: only mount current + prev
          const shouldMount =
            keepAlive ? isCurrent || isLeaving || true : isCurrent || isLeaving;

          if (!shouldMount) return null;

          const hidden =
            !isCurrent && !isLeaving; // for keepAlive to avoid flashes

          const stateCls = isLeaving ? leaveCls : isCurrent ? enterCls : 'opacity-0';

          return (
            <div
              key={String(tab.key)}
              role="tabpanel"
              id={`${reactId}-panel-${tab.key}`}
              aria-labelledby={`${reactId}-tab-${tab.key}`}
              hidden={hidden}
              className={[
                'relative',
                transitionCls,
                stateCls,
                tab.panelClassName ?? '',
              ].join(' ')}
              style={{
                transitionDuration: `${durationMs}ms`,
                transitionTimingFunction: easing,
              }}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SmartTabs;
