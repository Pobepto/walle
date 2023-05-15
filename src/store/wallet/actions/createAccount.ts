import { WalletAction } from '..'

export const createAccount: WalletAction<'createAccount'> =
  (set, get) => (name, accountIndex, addressIndex) => {
    const accounts = [...get().accounts]

    const alreadyCreatedAccount = accounts.find(
      (account) =>
        account.accountIndex === accountIndex &&
        account.addressIndex === addressIndex,
    )

    if (alreadyCreatedAccount) {
      Object.assign(alreadyCreatedAccount, {
        ...alreadyCreatedAccount,
        name,
      })
    } else {
      let newAccountIndex = accountIndex
      let newAddressIndex = addressIndex

      if (newAccountIndex === undefined) {
        const indices = accounts.map((account) => account.accountIndex)
        const startIndex = Math.min(...indices)
        const endIndex = Math.max(...indices)

        for (let i = startIndex + 1; i <= endIndex + 1; i++) {
          if (!accounts.find((account) => account.accountIndex === i)) {
            newAccountIndex = i
            break
          }
        }
      } else if (newAddressIndex === undefined) {
        const targetAccounts = accounts.filter(
          (account) => account.accountIndex === newAccountIndex,
        )
        const indices = targetAccounts.map((account) => account.addressIndex)
        const startIndex = Math.min(...indices)
        const endIndex = Math.max(...indices)

        for (let i = startIndex + 1; i <= endIndex + 1; i++) {
          if (!targetAccounts.find((account) => account.addressIndex === i)) {
            newAddressIndex = i
            break
          }
        }
      }

      accounts.push({
        name,
        accountIndex: newAccountIndex!,
        addressIndex: newAddressIndex ?? 0,
      })
    }

    set({ accounts })
  }
