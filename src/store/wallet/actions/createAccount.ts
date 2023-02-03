import { WalletAction } from '..'

export const createAccount: WalletAction<'createAccount'> =
  (set, get) => (name, accountId) => {
    const accounts = [...get().accounts]

    const alreadyCreatedAccount = accounts.find(
      (account) => account.pathId === accountId,
    )

    if (alreadyCreatedAccount) {
      Object.assign(alreadyCreatedAccount, {
        name,
        pathId: alreadyCreatedAccount.pathId,
      })
    } else {
      let newAccountId = accountId

      if (newAccountId === undefined) {
        for (let i = 0; i <= accounts.length; i++) {
          if (!accounts.find((account) => account.pathId === i)) {
            newAccountId = i
            break
          }
        }
      }

      accounts.push({
        name,
        pathId: newAccountId!,
      })
    }

    set({ accounts })
  }
