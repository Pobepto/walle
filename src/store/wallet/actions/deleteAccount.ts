import { WalletAction } from '..'

export const deleteAccount: WalletAction<'deleteAccount'> =
  (set, get) => (accountId) => {
    const { accounts, pathId: currentAccountId } = get()

    if (accounts.length > 1 && accountId !== currentAccountId) {
      const newAccounts = [...accounts].filter(
        (account) => account.pathId !== accountId,
      )

      set({ accounts: newAccounts })
    }
  }
