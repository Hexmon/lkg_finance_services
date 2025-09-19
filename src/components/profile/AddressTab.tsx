'use client';

import React, { useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Select, Tooltip, message, Spin, Empty } from 'antd';
import { HomeFilled, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CardLayout } from '@/lib/layouts/CardLayout';
import { useAppSelector } from '@/lib/store';
import {
  useAddresses,
  useAddAddress,
  usePatchAddressLandmark,
} from '@/features/address/data/hooks';
import type { AddressRecord } from '@/features/address/domain/types';

/* ---------------- Small UI atoms (unchanged visuals) ---------------- */

const Chip = ({ color = 'blue', children }: { color?: 'blue' | 'green'; children: React.ReactNode }) => {
  const styles =
    color === 'green'
      ? 'bg-[#E9F8EE] text-[#2E7D32] border-[#CDEFD8]'
      : 'bg-[#EAF3FF] text-[#2F6FE4] border-[#C7E0FF]';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] leading-[14px] font-medium ${styles}`}>
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
  disabled,
  children,
}: {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <Tooltip title={title}>
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  </Tooltip>
);

/* ---------------- Address Card ---------------- */

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
      width="w-full"
      height="h-auto"
      padding="p-4 md:p-5"
      rounded="rounded-2xl"
      elevation={2}
      bordered
      hoverable
      className="shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
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
            {/* Delete not supported by API yet */}
            <GhostIconBtn title="Delete not available" disabled onClick={onDelete}>
              <DeleteOutlined style={{ fontSize: 16 }} />
            </GhostIconBtn>
          </div>
        </div>
      }
      body={
        <div className="mt-2 md:mt-3">
          {lines.map((line, idx) => (
            <div key={idx} className="text-[14px] leading-[22px] text-[#4E4E4E]">
              {line}
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ---------------- Inline Form ---------------- */

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
  mode,
  initialValues,
  loading,
  onSave,
  onCancel,
}: {
  mode: 'add' | 'edit'; // edit = only landmark is saved (per PATCH spec)
  initialValues?: Partial<FormValues>;
  loading?: boolean;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}) {
  const [form] = Form.useForm<FormValues>();
  const isEdit = mode === 'edit';

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSave}
      className="bg-[#FFFFFF] p-6 rounded-xl shadow-md h-[600px]"
      disabled={loading}
    >
      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="label" label="Address Label" rules={[{ required: true }]} className="!ml-3">
          <Select
            options={[{ value: 'Current' }, { value: 'Billing' }, { value: 'Other' }]}
            disabled={isEdit} // cannot change via PATCH/landmark-only
          />
        </Form.Item>

        <Form.Item name="addressLine" label="Address Line" rules={[{ required: true }]} className="!ml-3">
          <Input.TextArea rows={6} disabled={isEdit} />
        </Form.Item>

        <Form.Item name="country" label="Country" rules={[{ required: true }]} className="!ml-3">
          <Input disabled={isEdit} />
        </Form.Item>

        <Form.Item name="state" label="State" rules={[{ required: true }]} className="!ml-3">
          <Input disabled={isEdit} />
        </Form.Item>

        <Form.Item name="city" label="City" className="!ml-3">
          <Input disabled={isEdit} />
        </Form.Item>

        <Form.Item name="pincode" label="Pincode" rules={[{ required: true, len: 6 }]} className="!ml-3">
          <Input disabled={isEdit} inputMode="numeric" maxLength={6} />
        </Form.Item>

        <Form.Item
          name="landmark"
          label="Landmark"
          className="!ml-3"
          rules={isEdit ? [{ required: true, message: 'Please enter landmark' }] : undefined}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <Button onClick={onCancel} className="w-[355px] h-[45px] text-[12px] font-medium">
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-[355px] h-[45px] bg-[#3386FF] text-[12px] font-medium"
        >
          Save
        </Button>
      </div>
    </Form>
  );
}

/* ---------------- Helpers: mapping ---------------- */

// label -> address_type (upstream expects uppercase)
function mapLabelToAddressType(label: FormValues['label']): string {
  if (label === 'Current') return 'PERMANENT';
  if (label === 'Billing') return 'BILLING';
  return 'OTHER';
}

// address_type -> label (for initial values)
function mapAddressTypeToLabel(addressType: string): FormValues['label'] {
  const t = addressType?.toUpperCase();
  if (t === 'PERMANENT') return 'Current';
  if (t === 'BILLING') return 'Billing';
  return 'Other';
}

// API record -> card display lines
function toDisplayLines(a: AddressRecord): string[] {
  return [
    `${a.house || ''}${a.house && a.street ? ', ' : ''}${a.street || ''}`.trim(),
    a.landmark ? String(a.landmark) : '',
    `${a.vtc || a.dist || ''}${a.vtc || a.dist ? ', ' : ''}${a.state || ''} - ${a.pincode || ''}`,
    a.country || '',
  ].filter(Boolean);
}

// API record -> form values
function toFormInitialValues(a: AddressRecord): FormValues {
  return {
    label: mapAddressTypeToLabel(a.address_type),
    addressLine: [a.house, a.street].filter(Boolean).join(', '),
    city: a.vtc || a.dist || '',
    state: a.state || '',
    country: a.country || '',
    pincode: a.pincode || '',
    landmark: a.landmark || '',
  };
}

// form values -> POST body (fills required fields from available inputs)
function toAddBody(values: FormValues, userId: string) {
  const city = values.city || 'NA';
  const address_type = mapLabelToAddressType(values.label);

  return {
    user_id: userId,
    country: values.country,
    address_type,               // server uppercases in schema anyway
    dist: city,
    house: values.addressLine,
    landmark: values.landmark || '',
    pincode: values.pincode,
    po: city,
    state: values.state,
    street: values.addressLine,
    subdist: city,
    vtc: city,
    locality: city,
  };
}

/* ---------------- Main Component ---------------- */

export default function AddressTab() {
  const profile = useAppSelector((s) => s.profile?.data);
  const userId = profile?.user_id || '';

  // Data
  const { data, isLoading } = useAddresses({ user_id: userId }, !!userId);
  const list = useMemo(() => data?.data ?? [], [data]);

  // Mutations
  const { mutate: addAddress, isPending: isAdding } = useAddAddress();
  const { mutate: patchLandmark, isPending: isPatching } = usePatchAddressLandmark(userId);

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AddressRecord | null>(null);

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (record: AddressRecord) => {
    setEditing(record);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  // Save handler (POST for add, PATCH for edit-landmark)
  const handleSave = (values: FormValues) => {
    if (!userId) {
      message.error('Missing user id. Please sign in again.');
      return;
    }

    if (!editing) {
      // ADD
      const body = toAddBody(values, userId);
      addAddress(body, {
        onSuccess: () => {
          message.success('Address added');
          closeForm();
        },
        onError: (e: any) => {
          message.error(e?.message || 'Failed to add address');
        },
      });
    } else {
      // EDIT (PATCH landmark only)
      const landmark = values.landmark?.trim();
      if (!landmark) {
        message.warning('Please enter landmark');
        return;
      }
      patchLandmark(
        { landmark },
        {
          onSuccess: () => {
            message.success('Landmark updated');
            closeForm();
          },
          onError: (e: any) => {
            message.error(e?.message || 'Failed to update address');
          },
        }
      );
    }
  };

  return (
    <div className="w-full">
      {!showForm ? (
        <>
          <div className="mb-3 flex items-center justify-end">
            <Button
              type="primary"
              onClick={openAdd}
              className="!h-10 !rounded-xl !bg-[#1677ff] !border-none px-4 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
            >
              Add Address
            </Button>
          </div>

          {/* Listing */}
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Spin tip="Loading addresses..." />
            </div>
          ) : list.length === 0 ? (
            <div className="py-10">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No addresses yet. Click “Add Address” to create one."
              />
            </div>
          ) : (
            <div className="space-y-5">
              {list.map((a) => (
                <AddressCard
                  key={a.address_id}
                  badge={mapAddressTypeToLabel(a.address_type)}
                  lines={toDisplayLines(a)}
                  onEdit={() => openEdit(a)}
                  onDelete={() => {
                    Modal.info({
                      icon: <ExclamationCircleOutlined />,
                      title: 'Delete not available',
                      content: 'Address deletion is not supported yet.',
                    });
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <AddressForm
          mode={editing ? 'edit' : 'add'}
          loading={isAdding || isPatching}
          initialValues={editing ? toFormInitialValues(editing) : undefined}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
