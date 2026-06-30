interface WalletState {
  balance: number
  transactions: Transaction[]
  loading: boolean
}

interface Transaction {
  id: string
  amount: number
  type: 'TOPUP' | 'DEBIT' | 'REFUND'
  description: string
  reference?: string
  createdAt: string
}

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    balance: 0,
    transactions: [],
    loading: false
  }),

  actions: {
    async fetchBalance() {
      this.loading = true
      try {
        const { data } = await $fetch('/api/wallet/balance', {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.balance = data.balance
      } catch (error) {
        console.error('Error fetching balance:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTransactions() {
      this.loading = true
      try {
        const { data } = await $fetch('/api/wallet/transactions', {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.transactions = data.transactions
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        this.loading = false
      }
    },

    async topUp(amount: number, paymentMethod: string = 'gateway') {
      try {
        const { data } = await $fetch('/api/wallet/topup', {
          method: 'POST',
          body: { amount, paymentMethod },
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        
        // Update balance
        this.balance += amount
        
        // Add transaction to list
        this.transactions.unshift({
          id: data.transaction.id,
          amount,
          type: 'TOPUP',
          description: 'شارژ کیف پول',
          reference: data.transaction.reference,
          createdAt: new Date().toISOString()
        })
        
        return { success: true, data }
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || 'خطا در شارژ کیف پول' 
        }
      }
    },

    async charge(amount: number, description: string, reference?: string) {
      if (this.balance < amount) {
        return { 
          success: false, 
          error: 'موجودی کیف پول کافی نیست' 
        }
      }

      try {
        const { data } = await $fetch('/api/wallet/charge', {
          method: 'POST',
          body: { amount, description, reference },
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        
        // Update balance
        this.balance -= amount
        
        // Add transaction to list
        this.transactions.unshift({
          id: data.transaction.id,
          amount: -amount,
          type: 'DEBIT',
          description,
          reference,
          createdAt: new Date().toISOString()
        })
        
        return { success: true, data }
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || 'خطا در برداشت از کیف پول' 
        }
      }
    },

    formatAmount(amount: number): string {
      return new Intl.NumberFormat('fa-IR').format(amount)
    },

    formatCurrency(amount: number): string {
      return `${this.formatAmount(amount)} تومان`
    }
  }
})
