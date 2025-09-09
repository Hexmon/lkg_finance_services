import { CardLayout } from "@/lib/layouts/CardLayout";
import { Button, Typography } from "antd";
const { Title, Text } = Typography
export default function Profile({ username, virtual_account, totalBalance }: { username: string, virtual_account: { vba_account_number: string; vba_ifsc: string; }, totalBalance: number }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 flex justify-between items-center flex-wrap">
            {/* Left Section */}
            <div>
                <Title level={4} className="!mb-1 text-2xl !font-bold">
                    Welcome Back <span className="text-[#3386FF]">{username}!</span>
                </Title>
                <Text type="secondary" className="block mb-3 text-[12px]">
                    Your business dashboard is ready. Let’s make today productive!
                </Text>

                {/* Status Tags */}
                <div className="flex gap-2">
                    <span className="bg-white shadow-xl rounded-xl px-3 py-1 text-[#3386FF] text-[12px] font-semibold">
                        • All system Online
                    </span>
                    <span className="bg-[#5298FF54] shadow-xl px-3 py-1 rounded-xl text-[#3386FF] text-[12px] font-semibold">
                        Premium Member
                    </span>
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                <CardLayout
                    elevation={3}
                    rounded="rounded-lg"
                    padding="px-5 py-3"
                    width="min-w-[200px]"
                    height="h-auto"
                    bgColor="bg-white"
                    className="justify-between"
                    body={
                        <div className="flex flex-col justify-between h-full">
                            {/* Header Text */}
                            <div className="text-[#3386FF] text-[12px] font-medium flex justify-center mt-3">
                                Virtual Account
                            </div>

                            {/* Details */}
                            <div className="mt-2 space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] font-medium text-[#7E7A7A]">IFSC:</span>
                                    <span className="text-[10px] font-normal text-[#2C2C2C]">{virtual_account.vba_ifsc}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] font-medium text-[#7E7A7A]">Account no.:</span>
                                    <span className="text-[10px] font-normal text-[#2C2C2C]">{virtual_account.vba_account_number}</span>
                                </div>
                            </div>
                        </div>
                    }
                />
                <CardLayout
                    elevation={3}
                    rounded="rounded-lg"
                    padding="px-6 py-4"
                    height="h-auto"
                    width="min-w-[185px]"
                    bgColor="bg-white"
                    className="items-center justify-center"
                    body={
                        <div className="flex flex-col items-center">
                            <div className="text-[#3386FF] text-2xl font-semibold">
                                ₹ {totalBalance}
                            </div>
                            <div className="text-[#7E7A7A] text-[12px] font-medium mb-2">
                                Total Balance
                            </div>
                            <Button
                                type="primary"
                                size="small"
                                className="!bg-[#C6DDFF] !shadow-2xl !text-[#3386FF] !font-semibold !text-[12px] !rounded-md !px-3 !py-1"
                            >
                                + Add Money
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    )
}