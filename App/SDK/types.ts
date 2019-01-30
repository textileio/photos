export interface DiscoveredCafe {
  readonly peer: string
  readonly address: string
  readonly api: string
  readonly protocol: string
  readonly node: string
  readonly url: string
}
export interface DiscoveredCafes {
  readonly primary: DiscoveredCafe
  readonly secondary: DiscoveredCafe
}