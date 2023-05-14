import fs from 'fs/promises'
import path from 'path'

export const WALLE_SETTINGS = path.join(__dirname, 'walle.settings.json')

export const getWalletDataPath = (wallet: string) => {
  return path.join(__dirname, `walle.${wallet}.data`)
}

export const getWalletSettingsPath = (wallet: string) => {
  return path.join(__dirname, `walle.${wallet}.settings.json`)
}

export const save = async (data: string, file: string): Promise<void> => {
  // TODO: Add try catch later
  await fs.writeFile(file, data)
}

export const load = async (file: string): Promise<string> => {
  // TODO: Add try catch later
  const data = await fs.readFile(file, 'utf8')
  return data
}

export const open = async (file: string): Promise<fs.FileHandle> => {
  return fs.open(file, 'r+')
}

export const remove = async (file: string): Promise<void> => {
  // TODO: Add try catch later
  return fs.unlink(file)
}

export const isFileExist = async (file: string): Promise<boolean> => {
  try {
    await fs.access(file)
    return true
  } catch (error) {
    return false
  }
}
