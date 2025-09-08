import { useTransactionSummaryQuery } from "@/features/retailer/general";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { Badge, Typography } from "antd";
import Image from "next/image";

const { Text } = Typography

export default function RecentActivity() {
  const { data: { data: transactionData } = {}, isLoading } = useTransactionSummaryQuery({
    page: 1,
    per_page: 5,
    order: "desc",
  })

  return (
    <CardLayout
      className="!rounded-2xl !shadow-sm !w-full !mb-10"
      body={
        !isLoading && (
          <div>
            <div className="flex justify-between items-start w-full mb-4">
              <div>
                <Text strong className="block !font-semibold !text-[20px] mb-0">Recent Activity</Text>
                <Text className="!font-light !text-sm !text-[13px]">Manage Your Financial Account</Text>
              </div>

              <div className="w-[111px] h-[29px] flex items-center cursor-pointer shadow-[0px_4px_8.9px_rgba(0,0,0,0.1)] rounded-[9px] justify-center">
                <Image src="/eye.svg" alt="eye icon" width={15} height={15} />
                <Text className="!font-normal !text-[10px] ml-2 mt-[2px]">View All</Text>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {
                (transactionData ?? []).map((data) => {
                  return (
                    <div
                      key={data.id}
                      className="flex justify-between items-center bg-[#FFFFFF] rounded-xl px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-3 rounded-full flex items-center justify-center w-[55px] h-[55px]">
                          <Image src="/heart-line.svg" alt="heart line" width={26} height={30} />
                        </div>

                        <div>
                          <Text strong className="block">{data.service ?? ""}</Text>
                          <div className="text-sm text-gray-500">{data.name ?? ""}</div>
                          <div className="text-[10px] text-gray-400">{data.created_at ?? ""} min</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-[6px]">
                        <Text strong className="text-[#000000]">
                          {data.net_amount ?? ""}
                        </Text>

                        <Badge className="">{data.txn_status ?? ""}</Badge>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>)
      }
    />
  )
}