import { WalletAction } from '..'

export const deleteAccount: WalletAction<'deleteAccount'> =
  (set, get) => (accountIndex, addressIndex) => {
    const { accounts } = get()

    if (accounts.length > 1) {
      const newAccounts = accounts.filter(
        (account) =>
          account.accountIndex !== accountIndex ||
          account.addressIndex !== addressIndex,
      )

      set({ accounts: newAccounts })
    }
  }
