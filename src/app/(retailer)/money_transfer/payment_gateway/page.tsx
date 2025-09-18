"use client";

import React, { useState } from "react";
import { Card, Typography, Form, Input, Button, Table, Radio, Modal } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";

const { Text } = Typography;

type FormValues = {
    amount: number;
    gateway: string;
};

export default function PaymentGatewayPage() {
    const [form] = Form.useForm<FormValues>();

    const handleSubmit = (values: FormValues) => {
        console.log("Submitted:", values);
    };
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModalvw = () => setIsModalVisible(true);
    const handleCancelvw = () => setIsModalVisible(false);


    // PG charges data
    const pgChargesData = [
        { key: "1", service: "NET BANKING", charge: "15 Flat" },
        { key: "2", service: "UPI", charge: "0 %" },
        { key: "3", service: "DEBIT CARD (RUPAY)", charge: "0 %" },
        {
            key: "4",
            service: "DEBIT CARD (Mastercard, Visa, Maestro) More than 2000",
            charge: "1 %",
        },
        {
            key: "5",
            service: "DEBIT CARD (Mastercard, Visa, Maestro) upto 2000",
            charge: "0.5 %",
        },
        { key: "6", service: "CREDIT CARD", charge: "1.27 %" },
        { key: "7", service: "PREPAID CARD", charge: "1.27 %" },
        { key: "8", service: "WALLET", charge: "2 %" },
    ];

    const pgColumns = [
        {
            title: () => (
                <span className="!text-[14px] !font-medium text-[#232323]">Services</span>
            ),
            dataIndex: "service",
            key: "service",
            render: (service: string) => (
                <span className="!text-[#232323] !text-[10px] !font-normal">{service}</span>
            ),
        },
        {
            title: () => (
                <span className="!text-[14px] !font-medium text-[#232323]">PG Charges</span>
            ),
            dataIndex: "charge",
            key: "charge",
            render: (charge: string) => (
                <span className="!text-[#232323] !text-[10px] !font-normal">{charge}</span>
            ),
        },
    ];

    const [isModalVisiblevw, setIsModalVisiblevw] = useState(false);
    const handleOpen = () => setIsModalVisiblevw(true);
    const handleCancel = () => setIsModalVisiblevw(false);


    return (
        <DashboardLayout
            activePath="/wallet"
            sections={moneyTransferSidebarConfig}
            pageTitle="Payment Gateway"
        >
            <DashboardSectionHeader
            title=""
            />
            <div className="p-6 min-h-screen !mt-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Section */}
                <Card className="!rounded-2xl !shadow-md">

                    <Form<FormValues>
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        className="!text-[13px]"
                    >
                        {/* Amount */}
                        <Form.Item
                            label={
                                <span className="!text-[15px] !font-medium !leading-8 !mt-20">
                                    Amount
                                </span>
                            }
                            name="amount"
                            rules={[{ message: "Please enter amount" }]}
                        >
                            <Input size="large" placeholder="Enter Amount" />
                        </Form.Item>

                        {/* Gateway Selection */}
                        <Form.Item
                            label={
                                <span className="!text-[15px] !font-medium !leading-8">
                                    Choose Payment Gateway
                                </span>
                            }
                            name="gateway"
                            rules={[{ message: "Please select gateway" }]}
                        >
                            <Radio.Group>
                                <Radio value="Cashfree">
                                    <Image
                                        src="/cashfree.svg"
                                        alt="Cashfree"
                                        width={70}
                                        height={20}
                                        className="inline-block"
                                    />
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        {/* Add Money Button */}
                        <div className="flex justify-center mt-4">
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className=" !px-10 !h-[40px]"
                            >
                                Add Money
                            </Button>
                        </div>
                    </Form>
                </Card>

                {/* Right Section */}
                <Card className="!rounded-2xl !shadow-md col-span-2">

                    <div className="">
                        {/* Virtual Account */}
                        <div className="flex mb-7 bg-transparent">
                            <Card className="!rounded-2xl !shadow-md !w-[240px] ">
                                <div className="flex justify-end mb-0"
                                    onClick={handleOpen}
                                >
                                    <Image
                                        src="/info.svg"
                                        alt="info icon"
                                        width={12}
                                        height={12}
                                        className="object-contain"
                                    />
                                </div>
                                <Text className="!text-[15px] !font-medium !block !mb-2 !text-center !text-[#3386FF]">
                                    Virtual Account
                                </Text>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Text type="secondary" className="text-[10px]">IFSC:</Text>
                                        <Text strong className="text-[10px]">SBIN04ANEUB</Text>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text type="secondary" className="text-[10px]">Account no.:</Text>
                                        <Text strong className="text-[10px]">587653226995</Text>
                                    </div>
                                </div>

                            </Card>
                            <div className="mt-6 flex justify-center ml-30">
                                <Button className="!rounded-lg border !px-4 !h-[35px] !w-[192px] !bg-[#5298FF54] !text-[12px] !font-semibold !text-[#3386FF] !shadow-2xl"
                                >
                                    View PG Transaction
                                </Button>
                            </div>

                        </div>
                        {/* General Instructions */}
                        <Card className="!rounded-2xl !shadow-md !col-span-2 !h-[510pxs]">
                            <Text className="!text-[15px] !font-medium !text-[#3386FF] !block !mb-2">
                                General Instructions
                            </Text>
                            <p className="!space-y-2 !text-[12px] !text-[#7E7A7A] !font-medium">How to add wallet balance in LKG</p>
                            <ul className="!list-disc !ml-6 !space-y-2 !text-[12px] !text-[#7E7A7A] !font-medium">

                                <li>
                                    Load balance (PG) will update your wallet limit instantly once the transaction is successfull.
                                </li>
                                <li>
                                    The receiver will manually verify the fund request, which may take a few minutes during working days.
                                </li>
                                <li>
                                    For MDR charges kindly check the following details.
                                </li>
                                <li>
                                    Please do not close the window, refresh the page, press stop or the back button while the transaction is being processed.
                                </li>
                            </ul>
                        </Card>
                    </div>
                </Card>

                {/* Bottom Section - PG Charges Table */}
                <Card className="!rounded-2xl !shadow-md col-span-3">
                    <Text className="!space-y-2 !text-[12px] !text-[#7E7A7A] !font-medium">LKG Provides Several payment methods to upgrade Wallet Limit. You can add money to your wallet through the Payment Gateway mode using the Debit card, Credit card or the Net Banking Service.</Text>
                    <Text className="!text-[15px] !font-medium !text-[#3386FF] !block !mb-6 !mt-2">
                        General Instructions
                    </Text>
                    <Table
                        dataSource={pgChargesData}
                        columns={pgColumns}
                        pagination={false}
                        bordered={false}
                    />
                    <Text className="!text-[13px] !text-[#3386FF] mt-3 block">
                        * TDR charges are applicable and will be paid by Applicant.
                    </Text>
                    <Text className="!text-[10px] !font-normal">For all payments, applicable taxes will apply. All Above Pg Charges are GST Excluded.</Text>
                </Card>
            </div>
            <Modal
                open={isModalVisiblevw}
                onCancel={handleCancelvw}
                footer={null}
                closable={false}
                centered
                className="custom-pg-modal"
            >
                <div className="p-4 rounded-xl bg-[#FFFFFF]">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#3386FF] text-[15px] font-semibold">Virtual Wallet</h3>
                        <button onClick={handleCancel} className="text-[#3386FF] font-bold text-[18px]">
                            ✕
                        </button>
                    </div>
                    <p className="text-[12px] text-[#7E7A7A] font-medium mb-3">Get track of your amount</p>

                    <p className="text-[13px] font-medium text-[#7E7A7A] mb-1">About Virtual wallet:</p>
                    <ul className="list-disc ml-5 space-y-2 text-[12px] text-[#7E7A7A] font-medium">
                        <li>
                            The virtual account in LKG Infosolutions Pvt. Ltd. allows you to transfer funds directly from you.
                        </li>
                        <li>Funds are typically credited within 5 minutes to 24 hours.</li>
                        <li>We recommend using this method for quick and secure wallet top-ups.</li>
                        <li>To ensure a smooth and timely credit, please use RTGS, NEFT, or IMPS as the mode of payment.</li>
                    </ul>
                </div>
            </Modal>

        </DashboardLayout>
    );
}
