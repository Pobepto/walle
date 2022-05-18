import fs from 'fs'

const USER_DATA = 'walle.data'

export const save = async (data: string) => {
  // TODO: Add try catch later
  await fs.promises.writeFile(USER_DATA, data)
}

export const load = async () => {
  // TODO: Add try catch later
  const data = await fs.promises.readFile(USER_DATA, 'utf8')
  return JSON.parse(data)
}
