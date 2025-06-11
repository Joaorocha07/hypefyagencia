'use server'
interface IPasswordResetArgs {
  email?: string
  code?: string
  new_password?: string
  jwt: string
}
interface IPasswordResetResponse {
  error: string
  msgUser: string
  msgOriginal: string
}

export default async function passwordService({
  email,
  code,
  new_password,
  jwt
}: IPasswordResetArgs): Promise<IPasswordResetResponse | null> {
  try {
    const apiUrl = `${process.env.API_LOGIN}/password`

    const raw = JSON.stringify({
      email,
      new_password,
      code
    })

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', `Bearer ${jwt}`)

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      cache: 'no-cache'
    }

    const response = await fetch(apiUrl, requestOptions)
    const result: IPasswordResetResponse = await response.json()

    return result
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`)
    return null
  }
}
