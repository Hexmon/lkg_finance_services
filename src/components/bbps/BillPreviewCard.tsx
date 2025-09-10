import React from "react";
import { Card, Typography, Divider, Tag } from "antd";
import type { BillFetchResponse } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

const { Title, Text } = Typography;

type Props = {
  resp: BillFetchResponse["billFetchResponse"];
  exactness: "EXACT" | "RANGE" | null;
};

export default function BillPreviewCard({ resp, exactness }: Props) {
  const b = resp.billerResponse;
  return (
    <Card className="mt-4 rounded-xl">
      <Title level={5} className="!mb-2">Bill Preview</Title>
      <Divider className="!my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div><Text type="secondary">Customer</Text><div>{b.customerName}</div></div>
        <div><Text type="secondary">Bill No.</Text><div>{b.billNumber}</div></div>
        <div><Text type="secondary">Bill Date</Text><div>{b.billDate}</div></div>
        <div><Text type="secondary">Period</Text><div>{b.billPeriod}</div></div>
        <div><Text type="secondary">Due Date</Text><div>{b.dueDate}</div></div>
        <div>
          <Text type="secondary">Amount</Text>
          <div>{b.billAmount} {exactness === "EXACT" ? <Tag color="blue">Exact</Tag> : <Tag>Editable</Tag>}</div>
        </div>
      </div>
    </Card>
  );
}
