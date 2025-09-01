'use client';

import React from 'react';
import { Button } from 'antd';
import SmartModal from '@/components/ui/SmartModal';

export default function ModalDemo() {
  const [open, setOpen] = React.useState(false);
  const firstFieldRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="p-6">
      <Button type="primary" onClick={() => setOpen(true)}>
        Open SmartModal
      </Button>

      <SmartModal
        open={open}
        onClose={() => setOpen(false)}
        initialFocusRef={firstFieldRef}
        closeOnEsc
        closeOnBackdrop
        // Position & animation
        centered={false}
        placement="top"
        animation="slide-up"
        durationMs={260}
        easing="cubic-bezier(.2,.8,.2,1)"
        // Style hooks (Tailwind)
        maskClassName="bg-black/50 backdrop-blur-[2px]"
        containerClassName="px-4 sm:px-6"
        contentClassName="w-full max-w-lg mx-auto rounded-2xl bg-white shadow-xl"
        headerClassName="px-5 py-4 border-b border-gray-200"
        bodyClassName="px-5 py-4"
        footerClassName="px-5 py-3 border-t border-gray-200"
      >
        <SmartModal.Header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Transfer</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </SmartModal.Header>

        <SmartModal.Body>
          <p className="text-sm text-gray-600 mb-3">
            Enter recipient details to initiate a transfer.
          </p>

          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Recipient Name</label>
              <input
                ref={firstFieldRef}
                className="h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                className="h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="1000"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Recipient Name</label>
              <input
                ref={firstFieldRef}
                className="h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                className="h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="1000"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Recipient Name</label>
              <input
                ref={firstFieldRef}
                className="h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                className="h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="1000"
              />
            </div>
          </div>
        </SmartModal.Body>

        <SmartModal.Footer>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="primary" onClick={() => setOpen(false)}>
            Send
          </Button>
        </SmartModal.Footer>
      </SmartModal>
    </div>
  );
}
