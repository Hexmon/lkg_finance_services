'use client';

import React, {
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useId,
  KeyboardEvent,
  forwardRef,
  PropsWithChildren,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';

type AnimationVariant = 'fade' | 'scale' | 'slide-up' | 'slide-right';

type FocusRef =
  | React.MutableRefObject<HTMLElement | null>
  | React.RefObject<HTMLElement | null>;

export type SmartModalProps = {
  open: boolean;
  onClose?: () => void;

  /** A11y */
  ariaLabel?: string;
  ariaDescribedBy?: string;

  /** Behavior */
  closeOnEsc?: boolean;              // default: true
  closeOnBackdrop?: boolean;         // default: true
  destroyOnClose?: boolean;          // default: false (keep mounted but hidden)
  initialFocusRef?: FocusRef;

  /** Positioning & size */
  centered?: boolean;                // default: true
  placement?: 'center' | 'top' | 'bottom-right'; // quick presets
  zIndex?: number;                   // default: 1000

  /** Animation */
  animation?: AnimationVariant;      // default: 'scale'
  durationMs?: number;               // default: 220
  easing?: string;                   // default: 'cubic-bezier(.22,1,.36,1)'

  /** Styling hooks (Tailwind or custom classes) */
  maskClassName?: string;
  containerClassName?: string;       // wrapper of content (for placement paddings etc)
  contentClassName?: string;         // dialog panel

  /** These feed into default Header/Body/Footer via context (can also override per-slot using <SmartModal.Header className="..."> etc.) */
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  /** Optional portal root (falls back to document.body) */
  portalRootId?: string;

  /** Max height of the panel; if number, treated as px. Default: '85vh' */
  maxHeight?: string | number;
};

type SectionProps = PropsWithChildren<{ className?: string }>;

type SectionClassCtx = {
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
};

const SectionClassContext = React.createContext<SectionClassCtx>({});

/** Small helper: lock/unlock body scroll while open */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    const { body } = document;
    const prev = body.style.overflow;
    if (locked) body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prev;
    };
  }, [locked]);
}

/** Minimal focus trap */
function getFocusable(el: HTMLElement | null) {
  if (!el) return [] as HTMLElement[];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(el.querySelectorAll<HTMLElement>(selectors)).filter(
    (n) => !n.hasAttribute('disabled') && !n.getAttribute('aria-hidden')
  );
}

/* =====================
   Default slot parts
===================== */

const DefaultHeader = ({ children, className }: SectionProps) => {
  const { headerClassName } = useContext(SectionClassContext);
  return (
    <div
      className={[
        'px-4 py-3 border-b border-gray-200',
        headerClassName || '',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

const DefaultBody = ({ children, className }: SectionProps) => {
  const { bodyClassName } = useContext(SectionClassContext);
  return (
    <div
      className={[
        // Make the body the scrollable region
        'flex-1 min-h-0 overflow-y-auto',
        'px-4 py-4',
        bodyClassName || '',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

const DefaultFooter = ({ children, className }: SectionProps) => {
  const { footerClassName } = useContext(SectionClassContext);
  return (
    <div
      className={[
        'px-4 py-3 border-t border-gray-200 flex justify-end gap-2',
        footerClassName || '',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

/* =====================
   Base forwardRef modal
===================== */

const SmartModalBase = forwardRef<HTMLDivElement, PropsWithChildren<SmartModalProps>>(
  (
    {
      open,
      onClose,
      ariaLabel,
      ariaDescribedBy,
      closeOnEsc = true,
      closeOnBackdrop = true,
      destroyOnClose = false,
      initialFocusRef,
      centered = true,
      placement = 'center',
      zIndex = 1000,
      animation = 'scale',
      durationMs = 220,
      easing = 'cubic-bezier(.22,1,.36,1)',
      maskClassName = '',
      containerClassName = '',
      contentClassName = '',
      headerClassName = '',
      bodyClassName = '',
      footerClassName = '',
      portalRootId,
      maxHeight = '85vh',
      children,
    },
    ref
  ) => {
    const id = useId();
    const panelRef = useRef<HTMLDivElement | null>(null);
    const lastActiveRef = useRef<Element | null>(null);
    const mountedRef = useRef(false);
    const [ready, setReady] = React.useState(false);

    // SSR-safe portal readiness
    useEffect(() => setReady(true), []);

    // Persist mount if not destroyOnClose
    useEffect(() => {
      if (open) mountedRef.current = true;
    }, [open]);

    // Save the previously focused element to restore on close
    useEffect(() => {
      if (open) {
        lastActiveRef.current = document.activeElement;
      } else if (lastActiveRef.current instanceof HTMLElement) {
        lastActiveRef.current.focus?.();
      }
    }, [open]);

    // Lock body scroll while open
    useScrollLock(open);

    // Focus handling on open
    useLayoutEffect(() => {
      if (!open) return;
      const focusEl =
        (initialFocusRef?.current as HTMLElement | null) ||
        getFocusable(panelRef.current!)[0];
      focusEl?.focus?.();
    }, [open, initialFocusRef]);

    // ESC key handling (guarded by `open`)
    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (!open) return;
        if (e.key === 'Escape' && closeOnEsc && onClose) {
          e.stopPropagation();
          onClose();
        }
        if (e.key === 'Tab') {
          // trap focus
          const focusables = getFocusable(panelRef.current!);
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      [open, closeOnEsc, onClose]
    );

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!closeOnBackdrop || !onClose) return;
        // only close if clicking the mask, not the panel
        if (e.target === e.currentTarget) onClose();
      },
      [closeOnBackdrop, onClose]
    );

    // Animation class presets
    const baseTransition = `transition-all duration-[${durationMs}ms]`;
    const styleTiming: React.CSSProperties = {
      transitionTimingFunction: easing,
      transitionDuration: `${durationMs}ms`,
    };

    const maskBase =
      'fixed inset-0 bg-black/40 will-change-opacity ' +
      `${baseTransition} ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;

    const containerBase = [
      'fixed inset-0',
      // Allow container to scroll if panel height still exceeds viewport
      'overflow-y-auto',
      centered ? 'flex items-center justify-center' : '',
      placement === 'top' ? 'flex items-start justify-center pt-8' : '',
      placement === 'bottom-right' ? 'flex items-end justify-end p-4' : '',
      // small side padding helps on tiny screens
      'px-4 py-6',
    ]
      .filter(Boolean)
      .join(' ');

    // 🔧 Important: disable pointer events when closed so underlying buttons work
    const containerInteractCls = open ? 'pointer-events-auto' : 'pointer-events-none';

    const panelBase =
      [
        'relative outline-none focus:outline-none bg-white rounded-2xl shadow-2xl',
        // Make the panel a flex column so header/footer pin, body scrolls
        'flex flex-col',
        // Hide panel overflow; body handles vertical scrolling
        'overflow-hidden',
        'will-change-transform will-change-opacity',
        baseTransition,
      ].join(' ');

    const animMap: Record<AnimationVariant, string[]> = {
      fade: [open ? 'opacity-100' : 'opacity-0'],
      scale: [open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'],
      'slide-up': [open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'],
      'slide-right': [open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'],
    };

    const panelAnim = animMap[animation].join(' ');

    // Mount logic
    const shouldRender = destroyOnClose ? open : mountedRef.current || open;
    if (!shouldRender || !ready) return null;

    const root = (portalRootId && document.getElementById(portalRootId)) || document.body;

    const resolvedMaxHeight =
      typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

    const dialog = (
      <div aria-hidden={!open} style={{ zIndex }} className="relative">
        {/* MASK */}
        <div
          className={[maskBase, maskClassName].join(' ')}
          style={styleTiming}
          onMouseDown={handleBackdropClick}
        />

        {/* CONTAINER (placement / padding layer) */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabel ? `${id}-label` : undefined}
          aria-describedby={ariaDescribedBy ? `${id}-desc` : undefined}
          onKeyDown={onKeyDown}
          className={[containerBase, containerClassName, containerInteractCls].join(' ')}
          style={{ zIndex: zIndex + 1 }}
        >
          {/* PANEL */}
          <div
            ref={(node) => {
              panelRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            className={[panelBase, panelAnim, contentClassName].join(' ')}
            style={{
              ...styleTiming,
              // cap the panel's height, so the body area becomes scrollable
              maxHeight: resolvedMaxHeight,
              // sensible width defaults
              width: '100%',
              maxWidth: '42rem', // ~672px; override via contentClassName if needed
            }}
          >
            <SectionClassContext.Provider
              value={{ headerClassName, bodyClassName, footerClassName }}
            >
              {children}
            </SectionClassContext.Provider>
          </div>
        </div>
      </div>
    );

    return createPortal(dialog, root);
  }
);
SmartModalBase.displayName = 'SmartModal';

/* =====================
   Compound type & export
===================== */

export interface SmartModalCompound
  extends React.ForwardRefExoticComponent<
    React.PropsWithoutRef<PropsWithChildren<SmartModalProps>> &
      React.RefAttributes<HTMLDivElement>
  > {
  Header: React.FC<SectionProps>;
  Body: React.FC<SectionProps>;
  Footer: React.FC<SectionProps>;
}

const SmartModal = Object.assign(SmartModalBase, {
  Header: ({ children, className }: SectionProps) => (
    <DefaultHeader className={className}>{children}</DefaultHeader>
  ),
  Body: ({ children, className }: SectionProps) => (
    <DefaultBody className={className}>{children}</DefaultBody>
  ),
  Footer: ({ children, className }: SectionProps) => (
    <DefaultFooter className={className}>{children}</DefaultFooter>
  ),
}) as SmartModalCompound;

export default SmartModal;
