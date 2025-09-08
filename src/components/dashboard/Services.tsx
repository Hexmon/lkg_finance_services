import { CardLayout } from "@/lib/layouts/CardLayout";
import { Button, Card, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

type QuickLink = {
  meta: {
    id: string;
    display: string;
    icon: string;
    route: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
  };
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string | null;
};

type QuickLinkWithNav = QuickLink & {
  navigationURL: string;
};

type ServicesProps = {
  quick_link: QuickLink[];
};

export default function Services({ quick_link }: ServicesProps) {
  const router = useRouter()

  const items: QuickLinkWithNav[] = (quick_link ?? [])
    .slice(0, 4)
    .map((item) => {
      const formattedRoute =
        item.meta?.route
          ?.replace(/^\//, "") // remove leading slash
          ?.replace(/_/g, "-") || "/";

      return {
        ...item,
        navigationURL: formattedRoute,
      };
    });

  return (
    <Card className="rounded-2xl shadow-sm mb-6">
      <div className="flex flex-col">
        <Text strong className="!font-medium !text-[20px]">Quick Services</Text>
        <span className="font-light text-[12px] text-[#1D1D1D]">
          Access your most used services instantly
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8f8f8]">
        {items.map((data) => (
          <CardLayout
            key={data.meta.id ?? data.category_id}
            height="h-fit"
            elevation={2}
            bgColor="bg-white"
            body={
              <div className="flex flex-col justify-between items-center">
                <div className="bg-[#5298FF54] rounded-full p-3">
                  <Image
                    src={data.meta.icon}
                    alt={data.name || data.meta.display}
                    width={35}
                    height={35}
                  />
                </div>
                <Text className="!text-[#232323] !font-medium !text-[14px] mt-2">
                  {data.meta.display || data.name}
                </Text>
                <Text className="!text-[12px] !font-medium !text-[#787878] mb-4">
                  {data.description}
                </Text>
                <Button
                  size="middle"
                  onClick={() => router.push(data.navigationURL)}
                  type="primary"
                  className="!bg-[#3386FF] w-[80%] !rounded-xl"
                >
                  Get Started <Image src="/icons/Arrow.svg" width={12} height={12} alt="" />
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </Card>
  );
}
