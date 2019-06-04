import { create } from 'apisauce'
import Config from 'react-native-config'

export interface DiscoveredCafe {
  readonly peer: string
  readonly address: string
  readonly api: string
  readonly protocol: string
  readonly node: string
  readonly url: string
}

export interface DiscoveredCafes {
  readonly primary?: DiscoveredCafe
  readonly secondary?: DiscoveredCafe
}

export default function createApi(baseURL: string) {
  const api = create({
    baseURL,
    timeout: 2000
  })

  async function discoveredCafes() {
    const response = await api.get<DiscoveredCafes>('/cafes')
    if (response.ok) {
      if (response.data) {
        return response.data
      } else {
        throw new Error('missing response data')
      }
    } else {
      throw new Error(response.problem)
    }
  }

  return { discoveredCafes }
}
