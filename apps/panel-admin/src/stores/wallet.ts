import {defineStore} from "pinia"
import {ref, computed, inject} from "vue"
import {type AxiosInstance} from 'axios';
import {axiosKey} from "../plugins/axiosPlugins";

// اینترفیس داده دریافتی از API
interface ApiTransaction {
    id: string
    type: 'DEBIT' | 'CREDIT' | 'TOPUP' | 'REFUND'|'PENDING_CREDIT'
    amount: string // در API به صورت رشته آمده است
    description: string
    referenceId?: string
    createdAt: string
}

// اینترفیس نهایی مورد استفاده در کامپوننت
interface UiTransaction {
    id: string
    type: 'income' | 'fee' | 'outcome' // اضافه کردن outcome برای کسر موجودی
    title: string
    description: string
    amount: number
    date: string
    time: string
    trackingCode: string
}

export interface UserWallet {
    id: string
    balance: number
    //transactions: UiTransaction[]
    createdAt: string
    updatedAt: string
}

export const useWalletStore = defineStore("wallet", () => {
    // State
    const wallet = ref<UserWallet | null>(null)
    const balance = ref<number>(0)
    const transactions = ref<UiTransaction[]>([]) // لیست با نوع نهایی
    const platformFeeTransactions = ref<UiTransaction[]>([]) // لیست با نوع نهایی
    const loading = ref<boolean>(false)

    // Axios instance
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // متادیتای صفحه‌بندی
    const meta = ref<{ page: number, limit: number, total: number }>({
        page: 1,
        limit: 10,
        total: 0
    })

    // Actions
    const fetchBalance = async (walletType: string) => {
        loading.value = true
        try {
            const res = await axios.get("/wallet/tenant", {type: walletType})
            wallet.value = res.data
            balance.value = wallet.value.balance
        } catch (error) {
            console.error("Error fetching balance:", error)
        } finally {
            loading.value = false
        }
    }

    const fetchWallet = async () => {
        loading.value = true
        try {
            const res = await axios.get("/wallet/platform")
            wallet.value = res.data
        } catch (error) {
            console.error("Error fetching balance:", error)
        } finally {
            loading.value = false
        }
    }

    const topUp = async (amount: number, paymentMethod: string = 'gateway') => {
        try {
            const res = await axios.post("/wallet/topup", {amount, paymentMethod})
            const data = res.data.data

            // Update balance
            balance.value += amount

            // Add transaction to list (با ساختار جدید UiTransaction)
            const {date, time} = formatDateTime(new Date().toISOString())

            transactions.value.unshift({
                id: data.transaction.id,
                type: 'income', // شارژ کیف پول یعنی درآمد/واریز
                title: 'شارژ کیف پول',
                description: 'شارژ کیف پول',
                amount: amount,
                date: date,
                time: time,
                trackingCode: data.transaction.reference || data.transaction.id.slice(0, 8)
            })

            return {success: true, data}
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'خطا در شارژ کیف پول'
            }
        }
    }

    const charge = async (amount: number, description: string, reference?: string) => {
        if (balance.value < amount) {
            return {
                success: false,
                error: 'موجودی کیف پول کافی نیست'
            }
        }
        try {
            const res = await axios.post("/wallet/charge", {amount, description, reference})
            const data = res.data.data

            // Update balance
            balance.value -= amount

            // Add transaction to list (با ساختار جدید UiTransaction)
            const {date, time} = formatDateTime(new Date().toISOString())

            transactions.value.unshift({
                id: data.transaction.id,
                type: 'outcome', // برداشت یعنی هزینه/خروجی
                title: 'پرداخت سفارش', // یا هر عنوان مناسب دیگر
                description: description,
                amount: amount, // مبلغ مثبت ذخیره می‌شود، نوع آن مشخص‌کننده است
                date: date,
                time: time,
                trackingCode: reference || data.transaction.id.slice(0, 8)
            })

            return {success: true, data}
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'خطا در برداشت از کیف پول'
            }
        }
    }

    // Helpers (Computed or Functions)
    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('fa-IR').format(amount)
    }

    const formatCurrency = (amount: number): string => {
        return `${formatAmount(amount)} تومان`
    }

    // تابع کمکی برای فرمت تاریخ و زمان شمسی
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString)
        // استفاده از Intl برای تاریخ شمسی
        const dateFormatter = new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        // استفاده از Intl برای زمان
        const timeFormatter = new Intl.DateTimeFormat('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })

        return {
            date: dateFormatter.format(date),
            time: timeFormatter.format(date)
        }
    }

    // تابع اصلی Map کردن داده‌ها
    const mapTransactions = (apiData: any[]): UiTransaction[] => {
        return apiData.map((item) => {
            const { date, time } = formatDateTime(item.createdAt);
            const amountNum = parseFloat(item.amount);

            let mappedType: TransactionType = 'outcome';
            let title = 'تراکنش کیف پول';
            let isPositive = false;

            // منطق تشخیص نوع تراکنش
            switch (item.type) {
                case 'CREDIT':
                    mappedType = 'income';
                    title = item.description.includes('Refund') ? 'بازگشت وجه' : 'واریز به کیف پول';
                    isPositive = true;
                    break;

                case 'PENDING_CREDIT':
                    mappedType = 'pending_credit';
                    title = 'در انتظار تسویه بانکی';
                    isPositive = false; // معمولاً در انتظار، یعنی هنوز به دست شما نرسیده
                    break;

                case 'TOPUP':
                    mappedType = 'income'; // اگر بالا بردن موجودی توسط خود کاربر است
                    title = 'شارژ کیف پول';
                    isPositive = true;
                    break;

                case 'DEBIT':
                    if (item.description.toLowerCase().includes('fee') || item.description.includes('کارمزد')) {
                        mappedType = 'fee';
                        title = 'کسر کارمزد';
                    } else {
                        mappedType = 'outcome';
                        title = 'پرداخت سفارش';
                    }
                    isPositive = false;
                    break;

                case 'FEE_INCOME':
                    mappedType = 'fee_income';
                    title = 'درآمد کارمزد پلتفرم';
                    isPositive = true; // برای پنل پلتفرم مثبت است، برای دکتر منفی
                    isPositive = false; // فرض بر این است که این کامپوننت برای پنل دکتر است
                    break;

                case 'REFUND':
                    mappedType = 'refund';
                    title = 'بازگشت وجه';
                    isPositive = true;
                    break;

                default:
                    mappedType = 'outcome';
                    isPositive = false;
            }

            return {
                id: item.id,
                type: mappedType,
                title,
                description: item.description,
                amount: amountNum,
                date,
                time,
                trackingCode: item.referenceId || item.id.slice(0, 8),
                isPositive
            };
        });
    };

    const fetchTransactions = async (walletType: string) => {
        loading.value = true
        try {
            const res = await axios.get("/wallet/transactions/tenant")

            // فرض بر این است که ساختار پاسخ شامل data و meta است
            const apiTransactions = res.data.data || []
            transactions.value = mapTransactions(apiTransactions)

            if (res.data.meta) {
                meta.value = res.data.meta
            }

        } catch (error) {
            console.error("Error fetching transactions:", error)
            transactions.value = []
        } finally {
            loading.value = false
        }
    }

    const fetchPlatformFeeTransactions = async (walletType: string) => {
        loading.value = true
        try {
            const res = await axios.get("/wallet/transactions/platform-fee/tenant")

            // فرض بر این است که ساختار پاسخ شامل data و meta است
            const apiTransactions = res.data.data || []
            platformFeeTransactions.value = mapTransactions(apiTransactions)

            if (res.data.meta) {
                meta.value = res.data.meta
            }

        } catch (error) {
            console.error("Error fetching transactions:", error)
            transactions.value = []
        } finally {
            loading.value = false
        }
    }

    const fetchRevenueReport = async (period: 'weekly' | 'monthly' | 'quarterly') => {
        try {
            const response = await axios.get(`/vetClinic/tenants/finance/reports?period=${period}`)
            return response.data // آرایه‌ای از { label, total }
        } catch (error) {
            console.error('خطا در دریافت گزارش درآمد:', error)
            return []
        }
    }


    return {
        wallet,
        balance,
        transactions,
        platformFeeTransactions,
        loading,
        fetchBalance,
        fetchWallet,
        fetchTransactions,
        fetchPlatformFeeTransactions,
        fetchRevenueReport,
        topUp,
        charge,
        formatAmount,
        formatCurrency
    }
})

