export interface GroupStatus {
  numberComplete: number
  numberTotal: number
  sizeComplete: number
  sizeTotal: number
  error?: {
    id: string
    reason: string
  }
}
