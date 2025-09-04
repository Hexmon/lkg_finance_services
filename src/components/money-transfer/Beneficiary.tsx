"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { BeneficiariesData } from "@/config/app.config";

const { Title, Text } = Typography;

export default function Beneficiaries() {
    return (
        <Card className="rounded-2xl shadow-md mb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div>
                    <Title level={4} className="!mb-0">
                        Beneficiary Management
                    </Title>
                    <Text type="secondary">Manage your saved beneficiaries</Text>
                </div>
                <Button type="primary" className="!bg-[#3386FF] !w-[111px] !h-[35px] !rounded-[9px] !text-[10px]">
                    + Add Beneficiary
                </Button>
            </div>

            {/* Sender Info */}
            <div className="!bg-[#fefcf7] !p-4 !mb-6 !rounded-[15px] shadow-sm">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Title level={4} className="!mb-1">
                            Amit Kumar’s Saved Accounts
                        </Title>
                        <Text type="secondary">Senders Mobile No. 7032531753</Text>
                    </div>

                    <Button className="!bg-[#3386FF] !text-white !h-[35px] !w-[140px] !rounded-[9px] !text-[10px]">
                        Change Sender
                    </Button>
                </div>

                {/* Metrics Section */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="!flex !items-center !gap-2">
                        <Image src="/person-blue.svg" alt="user" width={30} height={30} />
                        <div>
                            <Text type="secondary" className="!block !text-sm !text-black !font-medium !text-[14px]">Beneficiary</Text>
                            <Text strong className="!text-[20px] !font-medium">2</Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Icon before label */}

                        <div>
                            {/* Label with inline icon */}
                            <div className="flex items-center gap-1">
                                <Text
                                    type="secondary"
                                    className="!text-sm !text-black !font-medium !text-[14px]"
                                >
                                    Total Limit
                                </Text>
                                <Image src="/money.svg" alt="info" width={15} height={15} />
                            </div>

                            {/* Amount with icon */}
                            <div className="flex items-center gap-1 mt-1">
                                <Image src="/money.svg" alt="money icon" width={15} height={15} />
                                <Text strong className="!text-[20px] !font-medium">25,000</Text>
                            </div>
                        </div>
                    </div>


                    <div className="!flex !items-center !gap-2">
                        <Image src="/refresh.svg" alt="clock" width={15} height={15} />
                        <div>
                            <Text type="secondary" className="!block !text-sm !text-black !font-medium !text-[14px]">Remaining Limit</Text>
                            <Text strong className="!text-[20px] !font-medium">25,000</Text>
                        </div>
                    </div>
                </div>
            </div>


            {/* Beneficiary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BeneficiariesData.map((b, idx) => (
                    <Card key={idx} className="rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="!bg-[#5298FF54] !rounded-[40px] !h-[55px] !w-[55px] !flex items-center !justify-center">
                                <Image
                                    src="/person-blue.svg"
                                    alt="Person image"
                                    width={35}
                                    height={35}
                                />
                            </div>
                            <div>
                                <Text strong>{b.name}</Text>
                                <div className="text-xs text-gray-500">{b.bank}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <Text type="secondary" className="text-sm">Account:</Text>
                            <Text className="font-medium text-sm">*****{b.account}</Text>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <Text type="secondary">Mobile: </Text> 
                            <Text className="font-medium text-sm">{b.moblie}•••••</Text>
                        </div>
                    <div className="flex items-center justify-center gap-2">
                        <Button type="primary" className="!bg-[#3386FF] !w-[182px] !h-[20px]">
                            Send
                        </Button>
                        <Image
                         src="/eye-black.svg"
                         alt="eye black"
                         width={15}
                         height={15} 
                        />
                    </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
}
