import { TransactionsData } from "@/config/app.config";
import React from "react";
import Image from "next/image";

// Dummy data for preview. Replace with actual data or props

export default function Transaction() {
    return (
        <div className="transaction-history-container p-6 bg-white w-full rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-[22px] font-semibold mb-1">Transaction History</h2>
                    <p className="text-sm font-light text-gray-600">Recent money transfer transactions</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-filter px-4 py-2 shadow w-[111px] h-[35px] rounded-[9px] flex justify-center items-center">
                        <Image
                        src="/filter.svg"
                        alt="Filter Search"
                        width={15}
                        height={15}
                        />
                        <span className="text-xs">Filter</span>
                    </button>
                    <button className="btn-filter px-4 py-2 shadow w-[111px] h-[35px] rounded-[9px] flex justify-center items-center">
                        <img src="/export.svg" alt="Export" className="w-4 h-4 inline-block mr-1" />
                        <span className="text-xs">Export</span>
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 text-xs font-semibold text-gray-700 pb-2 px-4 py-3 rounded-t-lg bg-[#F5F5F5]">
                <div>Beneficiaries</div>
                <div>Amount</div>
                <div>Mode</div>
                <div>Status</div>
                <div>Time</div>
                <div className="text-right">Actions</div>
            </div>

            {/* Transaction Rows */}
            <div className="space-y-2">
                {TransactionsData.map((tx, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center ${(idx + 1) % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'
                            } px-4 py-3 rounded-lg`}
                    >
                        <div className="!flex !items-center !gap-3 !rounded-[7px] !h-[34px]">
                            <div className="!bg-blue-200 rounded-sm !flex !items-center !justify-center !w-[38px] !h-[37px]">
                                <img src="/person-blue.svg" alt="avatar" className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-medium">{tx.name}</div>
                                <div className="text-xs text-gray-500">{tx.txnId}</div>
                            </div>
                        </div>
                        <div className="text-gray-800 font-semibold">₹{tx.amount.toLocaleString()}</div>
                        <div className="text-gray-700">{tx.mode}</div>
                        <div>
                            <span
                                className={`inline-block text-[11px] font-medium px-2 py-1 rounded-full ${tx.status === 'Success'
                                    ? 'bg-[#D4F6DA] text-[#0BA82F]'
                                    : tx.status === 'Processing'
                                        ? 'bg-[#FFE6B5] text-[#FFC107]'
                                        : 'bg-red-100 text-red-600'
                                    }`}
                            >
                                {tx.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">{tx.time}</div>
                        <div className="text-right">
                            <button className="p-1 rounded-full shadow-[0px_4px_8px_rgba(0,0,0,0.12)] hover:bg-gray-200">
                                <img src="/eye-black.svg" alt="View" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
