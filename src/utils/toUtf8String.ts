import { BytesLike } from '@ethersproject/bytes'
import { toUtf8String as _toUtf8String } from '@ethersproject/strings'

export const toUtf8String = (bytes: BytesLike) => {
  try {
    return _toUtf8String(bytes)
  } catch {
    return bytes.toString()
  }
}
