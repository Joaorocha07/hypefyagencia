'use server'
export interface ILoginArgs {
  nome: string
  email: string
  password: string
}
export interface ILoginResponse {
  error: string
  msgUser: string
  msgOriginal: string
}

export default async function registerService({
  nome,
  email,
  password
}: ILoginArgs): Promise<ILoginResponse | null> {
  try {
    const urlencoded = new URLSearchParams()
    urlencoded.append('key', `${process.env.CHAVE_KEY}`)
    
    const raw = JSON.stringify({
      nome,
      email,
      password
    })

    const apiUrl = `${process.env.API_LOGIN}/user`

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      cache: 'no-cache'
    }

    const response = await fetch(apiUrl, requestOptions)
    const result: ILoginResponse = await response.json()

    return result
  } catch (e) {
    console.error(`Error: ${JSON.stringify(e)}`)
    return null
  }
}
