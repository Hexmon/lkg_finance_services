import { CardLayout } from "@/lib/layouts/CardLayout";
import { BellOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";
const { Title, Text } = Typography;
export default function Profile({
  username,
  virtual_account,
  totalBalance,
}: {
  username: string;
  virtual_account: { vba_account_number: string; vba_ifsc: string };
  totalBalance: number;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpen = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  return (
    <>
      {/* Will Show the notification bar only when the account is upgraded */}
      <div className="flex items-center justify-between w-full bg-[#c6ddff] rounded-xl px-4 py-4 mb-4 shadow-sm border border-[#b3cfff]">
        <div className="flex items-center gap-3">
          <BellOutlined style={{ fontSize: 22, color: "#3386FF" }} />
          <span className="text-[#3386FF] text-[16px] font-medium">
            News: Congratulations — your account has been upgraded to
            Distributor.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#3386FF] text-xs font-semibold  rounded px-2 py-0.5">
            1/2
          </span>
          <button
            className="hover:bg-[#b3cfff] rounded-full p-1 transition"
            aria-label="Close notification"
            // onClick={() => setShowNotification(false)} -- Implement this later --
          >
            <CloseOutlined style={{ fontSize: 18, color: "#3386FF" }} />
          </button>
        </div>
      </div>

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
                <div className="flex justify-end mb-0" onClick={handleOpen}>
                  <Image
                    src="/info.svg"
                    alt="info icon"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                </div>
                <div className="text-[#3386FF] text-[12px] font-medium flex justify-center mt-3">
                  Virtual Account
                </div>

                {/* Details */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#7E7A7A]">
                      IFSC:
                    </span>
                    <span className="text-[10px] font-normal text-[#2C2C2C]">
                      {virtual_account.vba_ifsc}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#7E7A7A]">
                      Account no.:
                    </span>
                    <span className="text-[10px] font-normal text-[#2C2C2C]">
                      {virtual_account.vba_account_number}
                    </span>
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
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        centered
        className="custom-pg-modal"
      >
        <div className="p-4 rounded-xl bg-[#FFFFFF]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#3386FF] text-[15px] font-semibold">
              Virtual Wallet
            </h3>
            <button
              onClick={handleCancel}
              className="text-[#3386FF] font-bold text-[18px]"
            >
              ✕
            </button>
          </div>
          <p className="text-[12px] text-[#7E7A7A] font-medium mb-3">
            Get track of your amount
          </p>

          <p className="text-[13px] font-medium text-[#7E7A7A] mb-1">
            About Virtual wallet:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-[12px] text-[#7E7A7A] font-medium">
            <li>
              The virtual account in LKG Infosolutions Pvt. Ltd. allows you to
              transfer funds directly from you.
            </li>
            <li>Funds are typically credited within 5 minutes to 24 hours.</li>
            <li>
              We recommend using this method for quick and secure wallet
              top-ups.
            </li>
            <li>
              To ensure a smooth and timely credit, please use RTGS, NEFT, or
              IMPS as the mode of payment.
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
}
