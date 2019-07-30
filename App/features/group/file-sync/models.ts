export interface GroupStatus {
  groupId: string
  numberComplete: number
  numberTotal: number
  sizeComplete: number
  sizeTotal: number
  error?: {
    id: string
    reason: string
  }
}
