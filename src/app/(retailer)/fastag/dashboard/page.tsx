"use client";

import React, { useState } from "react";
import { Card, Typography, Modal } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import FastagTransactionHistory from "@/components/fastag/FastagTransactionHistory";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function VehicleRegistration() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<
        "FastagDetails" | "CheckTagDetails" | "RechargeWallet" | null
    >(null);

    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");

    const handleCardClick = (title: string) => {
        switch (title) {
            case "Upload KYC":
                router.push("/fastag/add_kyc");
                break;
            case "Set Threshold Limit":
                router.push("/fastag/set_threshold");
                break;
            case "Fastag Details":
                setModalType("FastagDetails");
                setIsModalOpen(true);
                break;
            case "Change Tag Status":
                router.push("/fastag/change_tag_status");
                break;
            case "Tag Replacement":
                router.push("/fastag/tag_replacement");
                break;
            case "Check Tag Details":
                setModalType("CheckTagDetails");
                setIsModalOpen(true);
                break;
            default:
                break;
        }
    };

    const actionCards = [
        { title: "Upload KYC", icon: "/upload-blue.svg" },
        { title: "Set Threshold Limit", icon: "/warning.svg" },
        { title: "Fastag Details", icon: "/fastag.svg" },
        { title: "Change Tag Status", icon: "/replace.svg" },
        { title: "Tag Replacement", icon: "/replace.svg" },
        { title: "Check Tag Details", icon: "/fastag.svg", badge: "N" },
    ];

    const handleReset = () => {
        setAmount("");
        setRemark("");
    };

    const handleLoadBalance = () => {
        console.log("Recharge Wallet:", { amount, remark });
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/subscribed"
            pageTitle="FASTag"
        >
            {/* Section Header */}
            <DashboardSectionHeader
                title="Fastag"
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
                arrowClassName="!text-[#2F2F2F]"
            />

            <div className="p-6 min-h-screen w-full ">
                {/* Content Card */}
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full ">
                    {/* Top Summary Card */}
                    <Card className="rounded-xl shadow-sm bg-[#FFF7EC] h-[74px] flex items-center px-4 mx-auto w-full !mb-7">
                        <div className="flex items-center justify-between w-full">
                            {/* Left Section */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/car.svg"
                                        alt="Car Icon"
                                        width={18}
                                        height={18}
                                        className="object-contain"
                                    />
                                    <Text className="!text-[15px] font-normal">Fastag Dashboard</Text>
                                </div>
                                <Text className="block text-gray-500 text-sm ml-6 font-light text-[12px]">
                                    Select Your Fastag services
                                </Text>
                            </div>

                            {/* Middle Section with Recharge */}
                            <div className="flex items-center justify-center gap-3 ml-45">
                                <div className="bg-[#EBEBEB] text-black text-sm font-medium px-3 py-1 rounded-[9px] w-[95px] h-[32px] flex items-center justify-center">
                                    ₹ 25,000
                                </div>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-[9px] flex items-center gap-2 w-fit h-[34px]"
                                    onClick={() => {
                                        setModalType("RechargeWallet");
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Image
                                        src="/plus.svg"
                                        alt="plus"
                                        width={15.83}
                                        height={15.83}
                                        className="object-contain"
                                    />
                                    Recharge Wallet
                                </button>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center justify-end gap-2 ml-55">
                                <div className="w-8 h-8 rounded-full bg-[#5298FF54] flex items-center justify-center">
                                    <Image src="/person.svg" alt="User Icon" width={18} height={18} />
                                </div>
                                <div className="text-right flex flex-col items-start">
                                    <Text className="font-medium text-sm">Vijay Singh</Text>
                                    <a
                                        href="tel:9241773811"
                                        className="text-blue-500 text-xs hover:underline"
                                    >
                                        Mobile No.- 9241773811
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Cards Grid Section */}
                    <div className="flex !gap-7 !mb-12">
                        {/* Vehicle List */}
                        <Card className="rounded-[20px] shadow-sm bg-[#FFF7EC] p-4 col-span-1 w-[260px] min-h-[330px]">
                            <Text className="text-[16px] font-semibold text-[#3386FF] mb-3 block">
                                Vehicle List
                            </Text>

                            {/* Search Bar */}
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Search Vehicle Number...."
                                    className="w-full text-[12px] px-3 py-[6px] pr-9 border border-[#e0e0e0] rounded-md focus:outline-none bg-[#D9D9D93B] placeholder:text-[#A9A9A9]"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                        />
                                    </svg>
                                </span>
                            </div>

                            {/* Table Header */}
                            <div className="bg-[#D9D9D93B] rounded-t-[6px] px-2 py-1 text-[11px] font-semibold text-[#2F2F2F] flex justify-between">
                                <span>Vehicle Number</span>
                                <span>Tag Valid Till</span>
                            </div>

                            {/* Vehicle List */}
                            <div className="overflow-y-auto max-h-[145px] bg-white px-2 py-1 text-[13px]">
                                {[
                                    { number: "TN12AH6423", date: "11 June 2025, 11AM" },
                                    { number: "MH14DL2996", date: "11 June 2025, 11AM" },
                                    { number: "MH14DL2996", date: "11 June 2025, 11AM" },
                                    { number: "MH14DL2996", date: "11 June 2025, 11AM" },
                                ].map((veh, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between py-[6px] border-b border-dashed border-[#EAEAEA]"
                                    >
                                        <span className="text-[#3386FF] font-medium text-[13px]">
                                            {veh.number}
                                        </span>
                                        <span className="text-[#3386FF] text-[12px]">{veh.date}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-3 px-2">
                                <Text className="text-[11px] text-[#3386FF]">Total-5</Text>
                                <button
                                    className="text-white text-[11px] bg-[#3386FF] hover:bg-[#2c76db] px-4 py-[6px] rounded-md"
                                    onClick={() => router.push("/fastag/add_vehicle")}
                                >
                                    Add vehicle
                                </button>
                            </div>
                        </Card>

                        {/* Action Cards */}
                        <div className="grid grid-cols-4 gap-12 mb-8">
                            {actionCards.map((item, idx) => (
                                <Card
                                    key={idx}
                                    onClick={() => handleCardClick(item.title)}
                                    className="rounded-[15px] shadow-sm bg-white p-6 flex items-center justify-center relative cursor-pointer hover:shadow-md transition-all duration-200 w-[180px] h-[105px]"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 h-full w-full">
                                        <div className="bg-[#5298FF54] rounded-[45px] w-[45px] h-[45px] flex items-center justify-center">
                                            <Image src={item.icon} alt={item.title} width={20} height={20} />
                                        </div>
                                        <Text className="text-sm font-medium !text-[#3386FF] text-center">
                                            {item.title}
                                        </Text>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Transaction History */}
                    <FastagTransactionHistory />
                </Card>
            </div>

            {/* Recharge Wallet Modal */}
            <Modal
                open={modalType === "RechargeWallet" && isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title="Recharge Wallet"
                width={500}
                className="fastag-modal !w-[808px] !h-[365px] !text-[20px] !font-medium"
            >
                <div className="space-y-4 mt-12">
                    <div className="flex flex-col justify-center ml-22">
                        <label className="text-sm font-medium">Enter Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-xl mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col justify-center ml-22">
                        <label className="text-sm font-medium">Remark</label>
                        <input
                            type="text"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className="w-xl mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-center mt-12 gap-3">
                        <button
                            onClick={handleReset}
                            className="border border-blue-500 text-blue-500 px-6 py-2 rounded-md hover:bg-blue-50 w-full"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleLoadBalance}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md w-full"
                        >
                            Load Balance
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Fastag Details Modal */}
            <Modal
                open={modalType === "FastagDetails" && isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title="Fastag Details"
                width={800}
                className="fastag-modal"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-[#2F2F2F]">
                        <thead className="bg-[#F5F5F5] text-[13px] font-semibold !h-[34px] !w-[940px] !rounded-[7px]">
                            <tr>
                                <th className="px-4 py-2">CardList</th>
                                <th className="px-4 py-2">Kit List</th>
                                <th className="px-4 py-2">ExpiryDateList</th>
                                <th className="px-4 py-2">CardStatusList</th>
                                <th className="px-4 py-2">Card Type List</th>
                                <th className="px-4 py-2">Network Type List</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            <tr className="border-t">
                                <td className="px-4 py-2">E2801105200081</td>
                                <td className="px-4 py-2">3416FA82033F583</td>
                                <td className="px-4 py-2">1029</td>
                                <td className="px-4 py-2">NETC_NOTEXCEPTION</td>
                                <td className="px-4 py-2">VC-4</td>
                                <td className="px-4 py-2">FASTAG</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>

            {/* Check Tag Details Modal */}
            <Modal
                open={modalType === "CheckTagDetails" && isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title="Vehicle Summary"
                width={900}
                className="fastag-modal"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-[#2F2F2F]">
                        <thead className="bg-[#F5F5F5] text-[13px] font-semibold !h-[34px]">
                            <tr>
                                <th className="px-4 py-2">TID</th>
                                <th className="px-4 py-2">Reg Number</th>
                                <th className="px-4 py-2">Vehicle Class</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Tag ID</th>
                                <th className="px-4 py-2">Issue Date</th>
                                <th className="px-4 py-2">Bank ID</th>
                                <th className="px-4 py-2">Com Vehicle</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            <tr className="border-t">
                                <td className="px-4 py-2">
                                    E20034120138
                                    <br />
                                    FE006CF1F79
                                </td>
                                <td className="px-4 py-2">TN22AB1212</td>
                                <td className="px-4 py-2">VC4</td>
                                <td className="px-4 py-2">NETC NOT Expectation</td>
                                <td className="px-4 py-2">
                                    3412573581
                                    <br />
                                    9ESD8347
                                </td>
                                <td className="px-4 py-2">2020-05-18</td>
                                <td className="px-4 py-2">6296487</td>
                                <td className="px-4 py-2">T</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
