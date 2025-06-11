'use server'

export interface IDeleteArgs {
  jwt: string
}

export interface IDeleteResponse {
  error: string
  msgUser: string
  msgOriginal: string
}

export default async function deleteService({
  jwt,
}: IDeleteArgs): Promise<IDeleteResponse | null> {
  try {

    const apiUrl = `${process.env.API_LOGIN}/user`

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', `Bearer ${jwt}`)

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
      cache: 'no-cache'
    }

    const response = await fetch(apiUrl, requestOptions)
    const result: IDeleteResponse = await response.json()

    return result
  } catch (e) {
    console.error(`Error: ${JSON.stringify(e)}`)
    return null
  }
}
