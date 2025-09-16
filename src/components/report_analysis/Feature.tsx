import { CardLayout } from "@/lib/layouts/CardLayout";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { Typography } from "antd";
const { Text } = Typography

type FeatureProps = {
    currentBalance: number;
    balanceGrowth: number;
    totalTransaction: number;
    totalTransactionGrowth: number;
    successRate: number;
    successRateGrowth: number;
    commission: number;
    commissionGrowth: number;
}

export default function Feature({currentBalance, balanceGrowth, totalTransaction, totalTransactionGrowth, commission, commissionGrowth, successRate, successRateGrowth} : FeatureProps) {

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
            <CardLayout
                elevation={2}
                rounded="rounded-3xl"
                padding="p-4"
                height="h-auto"
                bgColor="bg-white"
                body={
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="text-[#787878] text-[14px] font-medium">Current Balance</div>
                            <Image
                                src="/icons/total-transation.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">₹{currentBalance}</div>
                        <Text className="text-black text-[10px] font-light">
                            <CaretUpOutlined style={{ color: 'green' }} /> {balanceGrowth}% Since Last Month
                        </Text>
                    </div>
                }
            />
            <CardLayout
                elevation={2}
                rounded="rounded-3xl"
                padding="p-4"
                height="h-auto"
                bgColor="bg-white"
                body={
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="text-[#787878] text-[14px] font-medium">Total Transaction</div>
                            <Image
                                src="/icons/success-rate.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">{totalTransaction}</div>
                        <Text className="text-black text-[10px] font-light">
                            <CaretUpOutlined style={{ color: 'green' }} /> {totalTransactionGrowth}% Since Last Month
                        </Text>
                    </div>
                }
            />
            <CardLayout
                elevation={2}
                rounded="rounded-3xl"
                padding="p-4"
                height="h-auto"
                bgColor="bg-white"
                body={
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="text-[#787878] text-[14px] font-medium">Commission Earned</div>
                            <Image
                                src="/customer.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">₹{commission}</div>
                        <Text className="text-black text-[10px] font-light">
                            <CaretDownOutlined style={{ color: 'red' }} />{commissionGrowth}% Since Last Month
                        </Text>
                    </div>
                }
            />
            <CardLayout
                elevation={2}
                rounded="rounded-3xl"
                padding="p-4"
                height="h-auto"
                bgColor="bg-white"
                body={
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="text-[#787878] text-[14px] font-medium">Success Rate</div>
                            <Image
                                src="/icons/commission.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">{successRate}%</div>
                        <Text className="text-black text-[10px] font-light">
                            <CaretUpOutlined style={{ color: 'green' }} /> {successRateGrowth}% Since Last Month
                        </Text>
                    </div>
                }
            />
        </div>
    )
} 