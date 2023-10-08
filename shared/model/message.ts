export interface MessageBase {
    type: MessageType
    text: string
    date: Date
}

export interface ChatMessage extends MessageBase {
    username: string
}

export enum MessageType {
    TEXT, INFO, WHO, ERROR, ONLINE
}