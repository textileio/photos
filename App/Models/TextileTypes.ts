export interface Event {
  name: string
  payload: string
}

export interface ThreadItem {
  id: string
  name: string
  peers: number
}

export interface Threads  {
  items: ThreadItem[]
}

export interface DeviceItem {
  id: string
  name: string
}

export interface Devices {
  items: DeviceItem[]
}

export enum BlockType {
  InviteBlock = 1,
	PhotoBlock,
	CommentBlock,
	LikeBlock
}

export interface BlockItem {
	id: string
	target: string
	parents: string[]
	type: BlockType
	date: Date
}

export interface Blocks {
  items: BlockItem[]
}

export interface PinRequest {
  boundary: string
  payloadPath: string
}

export interface PinRequests {
  items: PinRequest[]
}
