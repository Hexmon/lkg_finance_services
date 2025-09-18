'use client';

import React from 'react';
import { Button, Form, Input, Modal, Select, Tooltip } from 'antd';
import {
    HomeFilled,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { CardLayout } from '@/lib/layouts/CardLayout';
import { useState } from 'react';

// ---------- Small UI atoms ----------
const Chip = ({
    color = 'blue',
    children,
}: {
    color?: 'blue' | 'green';
    children: React.ReactNode;
}) => {
    const styles =
        color === 'green'
            ? 'bg-[#E9F8EE] text-[#2E7D32] border-[#CDEFD8]'
            : 'bg-[#EAF3FF] text-[#2F6FE4] border-[#C7E0FF]';
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] leading-[14px] font-medium ${styles}`}
        >
            {children}
        </span>
    );
};

const RoundIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3FF] text-[#2F6FE4]">
        {children}
    </div>
);

const GhostIconBtn = ({
    title,
    onClick,
    children,
}: {
    title: string;
    onClick?: () => void;
    children: React.ReactNode;
}) => (
    <Tooltip title={title}>
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md"
        >
            {children}
        </button>
    </Tooltip>
);

// ---------- Address Card (uses your CardLayout) ----------
type AddressCardProps = {
    badge: 'Current' | 'Billing' | 'Other';
    lines: string[]; // each address line
    onEdit?: () => void;
    onDelete?: () => void;
};

function AddressCard({ badge, lines, onEdit, onDelete }: AddressCardProps) {
    const isCurrent = badge === 'Current';

    return (
        <CardLayout
            // "pixel perfect" sizing & visuals
            width="w-full"
            height="h-auto"
            padding="p-4 md:p-5"
            rounded="rounded-2xl"
            elevation={2}
            bordered
            hoverable
            className="shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
            // header / body composed below
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <RoundIcon>
                            <HomeFilled />
                        </RoundIcon>
                        <Chip color={isCurrent ? 'green' : 'blue'}>{badge}</Chip>
                    </div>

                    <div className="flex items-center gap-2">
                        <GhostIconBtn title="Edit" onClick={onEdit}>
                            <EditOutlined style={{ fontSize: 16 }} />
                        </GhostIconBtn>
                        <GhostIconBtn title="Delete" onClick={onDelete}>
                            <DeleteOutlined style={{ fontSize: 16 }} />
                        </GhostIconBtn>
                    </div>
                </div>
            }
            body={
                <div className="mt-2 md:mt-3">
                    {lines.map((line, idx) => (
                        <div
                            key={idx}
                            className="text-[14px] leading-[22px] text-[#4E4E4E]"
                        >
                            {line}
                        </div>
                    ))}
                </div>
            }
        />
    );
}

// ---------- Inline Form ----------
type FormValues = {
  label: 'Current' | 'Billing' | 'Other';
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
};

function AddressForm({
  initialValues,
  onSave,
  onCancel,
}: {
  initialValues?: Partial<FormValues>;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSave}
      className="bg-[#FFFFFF] p-6 rounded-xl shadow-md h-[600px]"
    >
        <div className="grid grid-cols-2 gap-4">
      <Form.Item name="label" label="Address Label" rules={[{ required: true }]} className='!ml-3'>
        <Select options={[{ value: 'Current' }, { value: 'Billing' }, { value: 'Other' }]} />
      </Form.Item>

      <Form.Item name="addressLine" label="Address Line" rules={[{ required: true }]} className='!ml-3'>
        <Input.TextArea rows={6} />
      </Form.Item>

      <Form.Item name="country" label="Country" rules={[{ required: true }]} className='!ml-3'>
        <Input />
      </Form.Item>

      <Form.Item name="state" label="State" rules={[{ required: true }]} className='!ml-3'>
        <Input />
      </Form.Item>

      <Form.Item name="city" label="City" className='!ml-3' >
        <Input />
      </Form.Item>

      <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]} className='!ml-3'>
        <Input />
      </Form.Item>

      <Form.Item name="landmark" label="Landmark" className='!ml-3'>
        <Input />
      </Form.Item>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <Button onClick={onCancel} className='w-[355px] h-[45px] text-[12px] font-medium'>Cancel</Button>
        <Button type="primary" htmlType="submit" className='w-[355px] h-[45px] bg-[#3386FF] text-[12px] font-medium'>
          Save
        </Button>
      </div>
    </Form>
  );
}

// ---------- Main Component ----------
export default function AddressTab() {
  const [addresses, setAddresses] = useState<AddressCardProps[]>([
    {
      badge: 'Current',
      lines: [
        'Shri Kanaka Nilaya, Umachankar Nagar 1st Main',
        'Near City Hospital',
        'Rambeenu, Kumbaluru, Karnataka - 560001',
        'India',
      ],
    },
    {
      badge: 'Billing',
      lines: ['Plot No. 123, MG Road', 'Near City Hospital', 'Bangalore, Karnataka - 560001', 'India'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = (values: FormValues) => {
    const newAddress: AddressCardProps = {
      badge: values.label,
      lines: [
        values.addressLine,
        values.landmark || '',
        `${values.city}, ${values.state} - ${values.pincode}`,
        values.country,
      ].filter(Boolean),
    };

    if (editingIndex !== null) {
      const updated = [...addresses];
      updated[editingIndex] = newAddress;
      setAddresses(updated);
      setEditingIndex(null);
    } else {
      setAddresses([...addresses, newAddress]);
    }

    setShowForm(false);
  };

  const handleDelete = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {!showForm ? (
        <>
          <div className="mb-3 flex items-center justify-end">
            <Button
              type="primary"
              onClick={() => {
                setEditingIndex(null);
                setShowForm(true);
              }}
              className="!h-10 !rounded-xl !bg-[#1677ff] !border-none px-4 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
            >
              Add Address
            </Button>
          </div>

          <div className="space-y-5">
            {addresses.map((addr, i) => (
              <AddressCard
                key={i}
                {...addr}
                onEdit={() => {
                  setEditingIndex(i);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(i)}
              />
            ))}
          </div>
        </>
      ) : (
        <AddressForm
          initialValues={
            editingIndex !== null
              ? {
                  label: addresses[editingIndex].badge,
                  addressLine: addresses[editingIndex].lines[0],
                  landmark: addresses[editingIndex].lines[1],
                  city: addresses[editingIndex].lines[2]?.split(',')[0] || '',
                  state: addresses[editingIndex].lines[2]?.split(',')[1]?.split('-')[0]?.trim() || '',
                  pincode: addresses[editingIndex].lines[2]?.match(/\d+/)?.[0] || '',
                  country: addresses[editingIndex].lines[3] || '',
                }
              : undefined
          }
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
}