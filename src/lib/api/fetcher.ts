const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:4001'

const fetcher = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> => {
  try {
    const response = await fetch(`${endpoint}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(options.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error('API Error: ' + errorBody)
    }

    return await response.json()
  } catch (error) {
    // Improve this error handling
    // For this demo just adding null
    return null
  }
}

fetcher.get = <T = any>(path: string, options: RequestInit = {}) => {
  return fetcher<T>(path, { ...options, method: 'GET' })
}

fetcher.post = <T = any>(
  path: string,
  body: any,
  options: RequestInit = {}
) => {
  return fetcher<T>(path, {
    ...options,
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

fetcher.put = <T = any>(path: string, body: any, options: RequestInit = {}) => {
  return fetcher<T>(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

fetcher.delete = <T = any>(path: string, options: RequestInit = {}) => {
  return fetcher<T>(path, { ...options, method: 'DELETE' })
}

export default fetcher
