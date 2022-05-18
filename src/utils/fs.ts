import fs from 'fs'

const USER_DATA = 'walle.data'

export const save = async (data: string): Promise<void> => {
  // TODO: Add try catch later
  await fs.promises.writeFile(USER_DATA, data)
}

export const load = async (): Promise<string> => {
  // TODO: Add try catch later
  const data = await fs.promises.readFile(USER_DATA, 'utf8')
  return data
}

export const isUserDataExist = async (): Promise<boolean> => {
  try {
    await fs.promises.access(USER_DATA)
    return true
  } catch (error) {
    return false
  }
}
