// src\components\auth\SignupSuccess.tsx

"use client";

import Image from "next/image";
import { Card, Typography, Button } from "antd";
import { useRouter } from "next/navigation";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SignupSuccess({ userName }: { userName: string }) {
    const router = useRouter();

    return (
        <Card className="w-[492px] max-w-[440px] shadow-card !bg-gradient-to-b !from-[rgba(54,54,54,0.1)] !from-[2.69%] !to-[rgba(20,20,20,0.1)] !to-[91.84%] backdrop-blur-md p-6 z-4">
            {/* <Card className="w-[492px] max-w-[440px] shadow-card   bg-gradient-to-b from-[rgba(54,54,54,0.1)] from-[2.69%] to-[rgba(20,20,20,0.1)] to-[91.84%] backdrop-blur-md p-6 z-4"> */}
            {/* Logo */}
            <div className="flex justify-center mb-4">
                <Image src="/logo.png" alt="LKG Infosolution" width={160} height={40} priority />
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
                <Title level={3} className="!mb-1 text-[#232323] font-semibold text-center">
                    Onboarding Application
                </Title>
            </div>

            <div className="bg-white shadow-2xl rounded-xl py-12 px-4 mb-8 flex flex-col items-center">
                {/* Success icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#4CAF50] flex items-center justify-center">
                        <CheckOutlined style={{ fontSize: 28, color: "#fff" }} />
                    </div>
                </div>

                {/* Message */}
                <div className="text-center mb-6">
                    <Text className="text-[#232323]">
                        Congratulation your account has been created,
                        <br />
                        Please check your Email for Login Credentials
                    </Text>
                </div>

                {/* Login button */}
                <Button
                    type="primary"
                    size="small"
                    block
                    onClick={() => router.push(`/signin?username=${encodeURIComponent(userName)}`)}
                    className="!h-9 !rounded-[8px] !bg-[#FFC107] !border-[#FFC107] !text-black !font-semibold !w-1/2"
                >
                    Login
                </Button>
            </div>
        </Card>
    );
}
