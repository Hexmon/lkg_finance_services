'use client';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SmartTabs, { TabItem } from '@/components/ui/SmartTabs';
import DashboardSectionHeader from '@/components/ui/DashboardSectionHeader';
import { moneyTransferSidebarConfig } from '@/config/sidebarconfig';
import DashboardLayout from '@/lib/layouts/DashboardLayout';
import ProfileDetailsTab from '@/components/profile/ProfileDetailsTab';
import BankingDetailsTab from '@/components/profile/BankingDetailsTab';
import AddressTab from '@/components/profile/AddressTab';
import PasswordReset from '@/components/profile/ChangePassword';

export default function ProfileTabsDemo() {
    const items: TabItem[] = [
        {
            key: 'personal',
            label: <span className='mx-3'>Personal Details</span>,
            content: <ProfileDetailsTab />,
        },
        {
            key: 'bank',
            label: <span className='mx-3'>Banking Details</span>,
            content: <BankingDetailsTab />,
        },
        {
            key: 'address',
            label: <span className='mx-3'>Address</span>,
            content: <AddressTab />,
        },
        {
            key: 'changepassword',
            label: <span className='mx-3'>Change Password</span>,
            content: <PasswordReset />,
        },
    ];

    return (
        <DashboardLayout pageTitle="Dashboard" activePath="/" sections={moneyTransferSidebarConfig}>
            <DashboardSectionHeader title="Profile" titleClassName="text-[20px]" />
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6">
                <SmartTabs
                    items={items}
                    keepAlive
                    fitted={false}
                    durationMs={260}
                    easing="cubic-bezier(.22,1,.36,1)"
                    // extra={
                    //     <Button
                    //         type="primary"
                    //         icon={<PlusOutlined />}
                    //         className="!h-10 !rounded-xl !bg-[#1677ff] !border-none transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
                    //     >
                    //         Add Address
                    //     </Button>
                    // }
                />
            </div>
        </DashboardLayout>
    );
}
