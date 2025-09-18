import { CardLayout } from "@/lib/layouts/CardLayout";
import { CaretUpOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography

export default function Feature({ totalTxnCount, totalTxnRatio, success_rate, success_rate_ratio, commissions, total_users_count }: { totalTxnCount: number, totalTxnRatio: number, success_rate: number, success_rate_ratio: number, commissions: { overall: number, overall_ratio: number }, total_users_count: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                                src="/icons/total-transation.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">{totalTxnCount}</div>
                        <Text type="success" className="text-black text-[10px] font-light">
                            <div className="flex gap-1">
                                <Image
                                    src="/up-arrow.svg"
                                    alt=""
                                    width={15.58}
                                    height={8.5}
                                    className="object-contain"
                                />
                                {/* <Image
                                src="/3.2.svg"
                                alt=""
                                width={24}
                                height={13}
                                className="object-contain"
                            /> */}
                                {totalTxnRatio} Since Last Month </div>
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
                                src="/icons/success-rate.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">{success_rate}%</div>
                        <Text type="success" className="text-black text-[10px] font-light">
                            <div className="flex gap-1">
                                <Image
                                    src="/up-arrow.svg"
                                    alt=""
                                    width={15.58}
                                    height={8.5}
                                    className="object-contain"
                                /> {success_rate_ratio} Since Last Month
                            </div>
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
                            <div className="text-[#787878] text-[14px] font-medium">Customers</div>
                            <Image
                                src="/icons/customer.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">{total_users_count}</div>
                        <Text type="success" className="text-black text-[10px] font-light">
                            <div className="flex gap-1">
                                <Image
                                    src="/up-arrow.svg"
                                    alt=""
                                    width={15.58}
                                    height={8.5}
                                    className="object-contain"
                                /> 3.2 Since Last Month
                            </div>
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
                            <div className="text-[#787878] text-[14px] font-medium">Commissions</div>
                            <Image
                                src="/icons/commission.svg"
                                alt=""
                                width={25}
                                height={25}
                                className="bg-[#3385ff3d] rounded-full p-1"
                            />
                        </div>
                        <div className="font-semibold text-[32px]">{commissions.overall}</div>
                        <Text type="success" className="text-black text-[10px] font-light">
                                                        <div className="flex gap-1">
                                <Image
                                src="/up-arrow.svg"
                                alt=""
                                width={15.58}
                                height={8.5}
                                className="object-contain"
                            /> {commissions.overall_ratio} Since Last Month
                            </div>
                        </Text>
                    </div>
                }
            />
        </div>
    )
}