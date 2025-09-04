"use client";

import React from "react";
import { Card, Typography, Button, Select, Input } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;
const { Option } = Select;

export default function NewTransfer() {
    return (
        <Card className="rounded-2xl shadow-md p-6">
            {/* Transfer Title */}
            <Title level={4} className="!mb-0">Transfer</Title>
            <Text type="secondary" className="block mb-6">Choose the best option for your transfer</Text>

            {/* Beneficiary Card */}
            <div className="bg-white rounded-[15px] shadow p-4 mb-6 w-full max-w-sm mx-auto">
                {/* Top: Avatar + Name */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#5298FF54] rounded-full p-2 w-[55px] h-[55px] flex items-center justify-center">
                            <Image src="/person-blue.svg" alt="avatar" width={30} height={30} />
                        </div>
                        <div>
                            <Text strong className="block">Rajesh Kumar</Text>
                            <Text className="text-gray-500 text-sm block">SBI</Text>
                        </div>
                    </div>
                    <Text className="!text-[12px] !text-blue-500 !mt-1">Sender — Receiver</Text>
                </div>

                {/* Bottom: Account and IFSC Info (full width) */}
                <div className="mt-1 space-y-1">
                    <div className="flex justify-between">
                        <Text className="text-gray-500 text-sm">Account:</Text>
                        <Text className="text-black text-sm font-medium">*****1234</Text>
                    </div>
                    <div className="flex justify-between">
                        <Text className="text-gray-500 text-sm">IFSC Code:</Text>
                        <Text className="text-black text-sm font-medium">SBIFN89</Text>
                    </div>
                </div>
            </div>



            {/* Transfer Form Fields */}
            <div className="space-y-4">
                {/* Mode of Transfer */}
                <div>
                    <Text type="secondary" className="!block !mb-1 !text-[12px] !font-medium !text-[#232323]">Mode of Transfer</Text>
                    <Select className="!w-full !h-[45px]" placeholder="Select Mode..">
                        <Option value="imps">IMPS</Option>
                        <Option value="neft">NEFT</Option>
                        <Option value="rtgs">RTGS</Option>
                    </Select>
                </div>

                {/* Transfer Options Table */}
                <div className="bg-white rounded-[12px] p-1 shadow-md">
                    {[
                        { method: "IMPS", info: "Instant Transfer (24*7)", fee: "₹5", time: "Instant", active: true },
                        { method: "NEFT", info: "Working Hours Only", fee: "₹2.5", time: "30min" },
                        { method: "RTGS", info: "", fee: "₹25", time: "30min" }
                    ].map((opt, idx) => (
                        <div
                            key={idx}
                            className={`flex justify-between items-center px-4 py-3 rounded-md ${opt.active ? "bg-[#E7F0FF]" : ""}`}
                        >
                            <div>
                                <Text strong>{opt.method}</Text>
                                <p className="text-xs text-gray-500">{opt.info}</p>
                            </div>
                            <div className="text-right">
                                <Text className="block text-sm text-gray-500">Fee <span className="text-black">{opt.fee}</span></Text>
                                <Text className="block text-sm text-gray-500">Time <span className="text-black">{opt.time}</span></Text>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transfer Amount */}
                <div>
                    <Text type="secondary" className="!block !mb-1 !text-[12px] !font-medium !text-[#232323]">Transfer Amount</Text>
                    <Input
                        className="!h-[36px] !rounded-[10px] !bg-[#8C8C8C1C]"
                        prefix="₹"
                        placeholder="0.00"
                    />
                    <div className="!text-xs !text-gray-400 mt-1 !text-[12px] !font-medium">Min: ₹100 <span className="float-right !text-[12px] !font-medium">Max: ₹2,00,000</span></div>
                </div>

                {/* Purpose of Transfer */}
                <div>
                    <Text type="secondary" className="!block !mb-1 !text-[12px] !font-medium !text-[#232323]">Purpose of Transfer</Text>
                    <Select className="w-full h-[45px]" placeholder="Select Purpose..">
                        <Option value="rent">Rent</Option>
                        <Option value="salary">Salary</Option>
                        <Option value="business">Business Payment</Option>
                    </Select>
                </div>
            </div>

            {/* Transfer Button */}
            <Button
                type="primary"
                className="!bg-[#3386FF] !w-full h-[38px] !mt-6 !rounded-[9px]"
            >
                Transfer Money
            </Button>
        </Card>
    );
}
