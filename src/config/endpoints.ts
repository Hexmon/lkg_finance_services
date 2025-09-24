// src\config\endpoints.ts
export const BASE_URLS = {
    AUTH_BASE_URL: 'https://auth-uat.bhugtan.in',
    ADMIN_BASE_URL: 'https://admin-uat.bhugtan.in',
    RETAILER_BASE_URL: 'https://retailer-uat.bhugtan.in',
    DISTRIBUTOR_BASE_URL: 'https://distributor-uat.bhugtan.in',
    PAYMENT_GATWEAY_BASE_URL: 'https://payment-uat.bhugtan.in',
    PAYPOINT_BASE_URL: 'https://paypoint-uat.bhugtan.in',
    BBPS_BASE_URL: 'https://bbps-uat.bhugtan.in',
    FASTTAG_BASE_URL: 'https://fastag-uat.bhugtan.in'
}

export const RETAILER_ENDPOINTS = {
    GENERAL: {
        DASHBOARD_DETAILS: "/secure/retailer/getDashboard",
        Transaction_SUMMARY: "/secure/retailer/transaction_summary",
    },
    FUND_REQUEST: {
        COMPANY_BANK_ACCOUNTS: "/secure/retailer/company_bank_accounts",
    },
    RETAILER_BBPS: {
        BBPS_ONLINE: {
            BILL_FETCH: {
                CIRCLE_LIST: "/secure/bbps/circle-list",
                CATEGORY_LIST: "/secure/bbps/bbps-category-list",
                BILLER_LIST: "/secure/bbps/biller-list",
                BILL_FETCH: "/secure/bbps/bills/bill-fetch",
                BILLER_INFO: "/secure/bbps/bills/biller-info",
            },
            MULTIPLE_BILLS: {
                ADD_ONLINE_BILLER: "/secure/bbps/add-online-biller",
                ONLINE_BILLER_LIST: "/secure/bbps/online-biller-list",
                UPDATE_ONLINE_BILLER: "/secure/bbps/update-online-biller",
                REMOVE_ONLINE_BILLER: "/secure/bbps/remove-online-biller",
                ONLINE_BILL_PROCEED: "/secure/bbps/online-bill-proceed",
            },
            BILL_AVENUE: {
                BILL_PAYMENT: "/secure/bbps/bills/bill-payment",
                TXN_STATUS: "/secure/bbps/bills/txn-status",
                COMPLAINT_REGISTER: "/secure/bbps/bills/complaint-Reg",
                TRACK_COMPLAINT: "/secure/bbps/bills/track-complaint",
                BILL_VALIDATION: "/secure/bbps/bills/bill-validation",
                ALL_PLANS: "/secure/bbps/bills/all-plans",
            },
        },
    },
    DMT: {
        SENDER: {
            CHECK_SENDER_REGISTER: "/secure/retailer/checksender",
            REGISTER_SENDERVERIFY_OTP: "/secure/retailer/verify-otp-onboard-sender",
            ADD_SENDER: "secure/retailer/addSender"
        },
        BENEFICIARIES: {
            VERIFY_IFSC: "/secure/retailer/verify_ifsc",
            ADD_BENIFICARY: "/secure/retailer/add_beneficiary"
        }
    },
    CASH_WITHDRAWL: {
        CHECK_AUTHENTICATION: "/secure/paypoint/aeps/check_authentication",
        TWO_FACTOR_AUTHENTICATION: "/secure/paypoint/aeps/two_factor_authentication",
        AEPS_TRANSACTION: "/secure/paypoint/aeps/aeps_transaction",
        BANK_LIST: "/secure/paypoint/aeps/banklist"
    },
    SERVICE: {
        SERVICE_LIST: "secure/retailer/service-list",
        SERVICE_SUBSCRIPTION_LIST: "secure/retailer/service-subscription-list",
        SUBSCRIPTIONS: "secure/retailer/subscriptions",
        SERVICE_CHARGES: "/secure/retailer/service-charges",
        SUBSCRIBE: "/secure/retailer/subscribe",
    },
    WALLET: {
        WALLET_BALANCE_BY_ID: "/secure/retailer/wallet-balance", // + /:walletId
        GET_WALLET_BALANCE: "/secure/retailer/get-wallet-balance/",
        GET_WALLET_STATEMENT: "/secure/retailer/get-wallet-statement",
        TRANSFER_AEPS_TO_MAIN: "/secure/retailer/transfer-aeps-to-main",
        PAYOUT: "/secure/retailer/payout",
        COMMISSION_SUMMARY: "/secure/retailer/commission-summary"
    },
    SUPPORT: {
        TICKET_LIST: "/admin/tickets",
    },
    BANK_ACCOUNT: {
        BANK_ACCOUNT: "/secure/retailer/bank_accounts"
    }
}

export const AUTHERIZATION_ENDPOINT = {
    AUTH_LOGIN_PATH: '/secure/login',
    AUTH_LOGOUT_PATH: '/secure/logout',
    AUTH_CHANGE_PASSWORD_PATH: '/secure/change-password',
    AUTH_RESET_PASSWORD_PATH: '/secure/reset-password ',
    AUTH_VERIFY_OTP_PASSWORD_PATH: '/secure/verify-otp-password',
    AUTH_FORGOT_USERNAME_PATH: '/secure/forgot-username',
    AUTH_VERIFY_OTP_USERNAME_PATH: '/secure/verify-otp',
    AUTH_FORGOT_PASSWORD_PATH: '/secure/forgot-password',
    AUTH_SEND_OTP_PATH: '/secure/create',
    AUTH_VERIFY_EMAIL_OTP_PATH: '/secure/verify-otp',
    AUTH_GENERATE_EMAIL_OTP_PATH: '/secure/generate-email-otp',
    AUTH_REGISTER_PATH: '/secure/register',
    AUTH_AADHAAR_OTP_GENERATE_PATH: '/secure/aadhar-otp-generate',
    AUTH_AADHAAR_OTP_VERIFY_PATH: '/secure/aadhar-otp-verify',
    AUTH_PAN_VERIFY_PATH: '/secure/pan-verify',
    PROFILE_GET_PATH: '/secure/profile',
    USER_PERMISSIONS_PATH: '/secure/get-user-permissions',
    AUTH_SEND_DEVICE_OTP_PATH: '/secure/send-otp',
    AUTH_VERIFY_ACCOUNT_OTP_PATH: '/secure/verify-otp',
    AUTH_VERIFY_ACCOUNT_OTP_PATH_ALL: '/secure/verify-otp-all',
    ADDRESS_PATH: '/secure/address',
    ACCOUNT_UPGRADE_PATH: '/secure/account-upgrade',
    AUTH_REQUEST_LOG_PATH: '/secure/request_log',
    AUTH_SUPPORT_CREATE_TICKET_PATH: '/secure/create-ticket',
    AUTH_SUPPORT_TICKETS_PATH: '/secure/tickets',
    AUTH_HEALTH_PATH: '/health',
}
