import { ServerWebSocket } from "bun";
import { ChatMessage, MessageBase, MessageType } from "../../shared/model/message";
import { connected } from "../server";

const getUsername = (ws: ServerWebSocket<any>) => ws.data.username;

export function openHandler(ws: ServerWebSocket<any>) {
    ws.subscribe("chat")

    let username = getUsername(ws)
    let message: ChatMessage = {
      date: new Date(),
      type: MessageType.INFO,
      text: `${username} has joined the chat`,
      username: getUsername(ws)
    }

    ws.publish("chat", JSON.stringify(message));
    connected.set(username, ws);
    console.log(username + " Connected");
    dispatchOnlineUsersChanges(ws);
}

export function messageHandler(ws: ServerWebSocket<any>, messageText: string) {
    let message: ChatMessage = {
      date: new Date(),
      type: MessageType.TEXT,
      text: messageText.toString(),
      username: getUsername(ws)
    }
    
    ws.send(JSON.stringify(message))
    ws.publish("chat", JSON.stringify(message))
}

export function closeHandler(ws: ServerWebSocket<any>, code: number, message_: string) {
    let username = getUsername(ws);
    connected.delete(username);
    ws.unsubscribe("chat");
    
    let message: ChatMessage = {
      date: new Date(),
      type: MessageType.INFO,
      text: `${username} has exited the chat`,
      username: getUsername(ws)
    }
    
    console.log(Array.from(connected.keys()));

    connected.forEach(socket => {
      socket.send(JSON.stringify(message))
    })
    
    dispatchOnlineUsersChanges(ws);
    console.log(username + " Disconnected");
}

function dispatchOnlineUsersChanges(ws: ServerWebSocket<any>) {
    let usersConnected = Array.from(connected.keys()).map(x => {
      if (x === getUsername(ws)) {
        x = "you"
      }
      return x
    });

    let message: MessageBase = {
      date: new Date(),
      type: MessageType.ONLINE,
      text: JSON.stringify(usersConnected),
    }

    console.log('connected', Array.from(connected.keys()));
    

    connected.forEach(socket => {
      socket.send(JSON.stringify(message))
    })
}