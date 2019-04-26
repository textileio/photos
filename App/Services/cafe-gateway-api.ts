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

const api = create({
  baseURL: Config.RN_TEXTILE_CAFE_GATEWAY_URL,
  timeout: 2000
})

const discoveredCafes = async () => {
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

export default { discoveredCafes }
