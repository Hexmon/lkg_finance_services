"use client";

import React from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { Card, Typography, Button } from "antd";
import WalletOutlined from "@ant-design/icons/lib/icons/WalletOutlined";
import { CardLayout } from "@/lib/layouts/CardLayout";
import Image from "next/image";
import { featureConfig, quickService, walletData, transactions } from "@/config/app.config";
import { useRouter } from "next/navigation";
const { Title, Text } = Typography;

export default function Dashboard() {
  const router = useRouter();

  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 flex justify-between items-center">
        {/* Left Section */}
        <div>
          <Title level={4} className="!mb-1 text-2xl !font-bold">
            Welcome Back <span className="text-[#3386FF]">Rajesh!</span>
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

        <div className="flex gap-4">
          <CardLayout
            elevation={3}
            rounded="rounded-lg"
            padding="px-5 py-3"
            width="min-w-[185px]"
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
                    <span className="text-[10px] font-normal text-[#2C2C2C]">SBIN004NUE9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-medium text-[#7E7A7A]">Account no.:</span>
                    <span className="text-[10px] font-normal text-[#2C2C2C]">587553226995</span>
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
                <div className="text-[#3386FF] text-2xl font-semibold">₹ 25,000</div>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {
          featureConfig.map((data) => {
            return (
              <CardLayout
                key={data.id}
                elevation={2}
                rounded="rounded-3xl"
                padding="p-4"
                height="h-auto"
                bgColor="bg-white"
                body={
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-[#787878] text-[14px] font-medium">{data.title}</div>
                      <Image
                        src={data.icon}
                        alt={data.title}
                        width={25}
                        height={25}
                        className="bg-[#3385ff3d] rounded-full p-1"
                      />
                    </div>
                    <div className="font-semibold text-[32px]">{data.quantity}</div>
                    <Text type="success" className="text-black text-[10px] font-light">{data.footer}</Text>
                  </div>
                }
              />
            )
          })
        }
      </div>

      {/* Quick Services */}
      <Card className="rounded-2xl shadow-sm mb-6">
        <div className="flex flex-col">
          <Text strong className="!font-medium !text-[20px]">Quick Services</Text>
          <span className="font-light text-[12px] text-[#1D1D1D]">Access your most used services instantly</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8f8f8]">
          {
            quickService.map((data) => {
              return (
                <CardLayout
                  key={data.id}
                  height="h-fit"
                  elevation={2}
                  bgColor="bg-white"
                  body={
                    <div className="flex flex-col justify-between items-center">
                      <div className="bg-[#5298FF54] rounded-full p-3">
                        <Image src={data.icon} alt={data.title} width={35} height={35} />
                      </div>
                      <Text className="!text-[#232323] !font-medium !text-[14px] mt-2">{data.title}</Text>
                      <Text className="!text-[12px] !font-medium !text-[#787878] mb-4">{data.subtitle}</Text>
                      <Button size="middle" onClick={() => router.push(data.navigationURL)} type="primary" className="!bg-[#3386FF] w-[80%] !rounded-xl">Get Started <Image src="/icons/Arrow.svg" width={12} height={12} alt="" /> </Button>
                    </div>
                  }
                />
              )
            })
          }
        </div>
      </Card>

      {/* Wallet Overview & Recent Activity */}
      <div className="flex flex-col md:flex-row gap-6 mt-4 w-full">
        <Card className="!rounded-2xl !shadow-sm !w-full !mb-10">
          <div className="flex justify-between items-start w-full mb-4">
            <div>
              <Text strong className="block !font-semibold !text-[20px] mb-0">Wallet Overview</Text>
              <Text className="!font-light !text-sm !text-[13px]">Manage Your Financial Account</Text>
            </div>

            <div className="w-[111px] h-[29px] flex items-center cursor-pointer shadow-[0px_4px_8.9px_rgba(0,0,0,0.1)] rounded-[9px] justify-center">
              <Image
                src="/upload.svg"
                alt="eye icon"
                width={15}
                height={15}
              />
              <Text className="!font-normal !text-[10px] ml-2 mt-[2px]">View All</Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {walletData.map((wallet) => (
              <CardLayout
                key={wallet.label}
                className="!min-h-[130px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
                header={
                  <div className="flex justify-between items-start w-full">
                    {/* Wallet Icon (left) */}
                    <div className="bg-blue-500 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                      <Image
                        src={wallet.icon}
                        alt={wallet.label}
                        width={35}
                        height={35}
                      />
                    </div>

                    {/* Growth Icon (right) */}
                    <Image
                      src={wallet.growthIcon}
                      alt="growth"
                      width={30}
                      height={13}
                      className="mt-3"
                    />
                  </div>
                }
                body={
                  <div>
                    <p className="text-[24px] font-bold text-black mt-2">
                      {wallet.amount}
                    </p>
                    <p className="text-gray-500 text-[14px] font-medium mt-1">
                      {wallet.label}
                    </p>
                  </div>
                }
              />
            ))}
          </div>
        </Card>

        <CardLayout
          className="!rounded-2xl !shadow-sm !w-full !mb-10"
          body={
            <div>
              <div className="flex justify-between items-start w-full mb-4">
                <div>
                  <Text strong className="block !font-semibold !text-[20px] mb-0">Recent Activity</Text>
                  <Text className="!font-light !text-sm !text-[13px]">Manage Your Financial Account</Text>
                </div>

                <div className="w-[111px] h-[29px] flex items-center cursor-pointer shadow-[0px_4px_8.9px_rgba(0,0,0,0.1)] rounded-[9px] justify-center">
                  <Image
                    src="/eyes.svg"
                    alt="eye icon"
                    width={15}
                    height={15}
                  />
                  <Text className="!font-normal !text-[10px] ml-2 mt-[2px]">View All</Text>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-[#FFFFFF] rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-3 rounded-full flex items-center justify-center w-[55px] h-[55px]">
                        <Image
                          src="/heart-line.svg"
                          alt="heart line"
                          width={26}
                          height={30}
                        />
                      </div>

                      <div>
                        <Text strong className="block">{tx.type}</Text>
                        <div className="text-sm text-gray-500">{tx.name}</div>
                        <div className="text-[10px] text-gray-400">{tx.time}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-[6px]">
                      <Text strong className="text-[#000000]">₹{tx.amount.toLocaleString()}</Text>

                      <div className={`
                            text-[5px] px-2 py-[2px] rounded-full text-[#0BA82F] font-medium capitalize w-[35px] h-[11px]
                            ${tx.status === "success" ? "bg-[#0BA82F36] text-[#0BA82F]" : ""}
                            ${tx.status === "failed" ? "bg-[#F9071854] text-[#FA0004]" : ""}
                            ${tx.status === "processing" ? "bg-[#FFC10769] text-[#FFC107]" : ""}
                  `}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          }
        />
      </div>

      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}

