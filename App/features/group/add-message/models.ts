export interface Message {
  readonly body: string
  readonly error?: string
}

export interface Messages {
  readonly [key: string]: Message
}

export interface Groups {
  readonly [key: string]: Messages | undefined
}
