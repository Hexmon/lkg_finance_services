"use client";

import Image from "next/image";

export default function PaymentSuccessPage() {
  return (
    <div className="p-6 min-h-screen bg-[#f9f6ef]">
      {/* Header outside */}
      <div className="flex items-center gap-2 mb-6">
        <button className="text-gray-700 text-lg">←</button>
        <h2 className="text-lg font-semibold text-gray-800">Payment Successful</h2>
      </div>

      {/* Full-width Success Card (same bg as inside) */}
      <div className="bg-green-50 border border-green-200 rounded-xl shadow-md p-6 w-full">
        {/* Top-right Logo */}
        <div className="flex justify-end mb-4">
          <Image
            src="/logo-as.svg"
            alt="logo"
            width={80}
            height={80}
            className="p-1"
          />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 w-16 h-16 flex items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-green-700 mb-2 text-center">
          Payment Completed!
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Your broadband bill payment has been processed successfully.
        </p>

        {/* Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 text-left mb-6">
          <div className="flex justify-between mb-3">
            <p className="text-gray-500 text-sm">Transaction ID</p>
            <p className="font-semibold">TXNIPRS02MQFZH</p>
          </div>

          <div className="flex justify-between mb-3">
            <p className="text-gray-500 text-sm">Amount Paid</p>
            <p className="font-semibold">₹999</p>
          </div>

          <div className="flex justify-between mb-3">
            <p className="text-gray-500 text-sm">Biller</p>
            <p className="font-semibold">Airtel Xstream Fiber</p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-500 text-sm">Customer ID</p>
            <p className="font-semibold">97886556</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium">
            Download Receipt
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
            Make Another Payment
          </button>
        </div>
      </div>
    </div>
  );
}
