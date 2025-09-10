import React from "react";
import { Modal, List, Tag, Alert } from "antd";
import type { Plan } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

type Props = {
  open: boolean;
  mandatory: boolean;
  loading: boolean;
  plans: Plan[];
  onCancel: () => void;
  onSelect: (p: Plan) => void;
};

export default function PlanChooserModal({ open, mandatory, loading, plans, onCancel, onSelect }: Props) {
  return (
    <Modal
      title="Select a Plan"
      open={open}
      onCancel={() => { if (!mandatory) onCancel(); }}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <div className="py-6 text-center">Loading plans…</div>
      ) : plans.length === 0 ? (
        <Alert type="warning" showIcon message="No active plans available right now." />
      ) : (
        <List
          dataSource={plans}
          renderItem={(p) => (
            <List.Item className="cursor-pointer" onClick={() => onSelect(p)} actions={[<Tag key="amt">₹{p.amountInRupees}</Tag>]}>
              <List.Item.Meta
                title={p.planDesc}
                description={
                  <>
                    <div>ID: {p.planId}</div>
                    {p.effectiveFrom && <div>From: {p.effectiveFrom}</div>}
                    {p.effectiveTo && <div>To: {p.effectiveTo}</div>}
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
      {mandatory && plans.length > 0 && <div className="mt-3 text-xs text-gray-500">Please select a plan to continue.</div>}
    </Modal>
  );
}
