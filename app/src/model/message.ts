export type Message = {
    type: MessageType
    username: string
    text: string
    date: Date
}

export enum MessageType {
    TEXT, INFO
}