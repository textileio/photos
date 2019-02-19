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

export interface AddingMessageItem {
  readonly type: 'addingMessage'
  readonly key: string
  readonly data: Message
}
