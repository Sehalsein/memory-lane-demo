'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePathCache(...params: Parameters<typeof revalidatePath>) {
  return revalidatePath(...params)
}
