import { ServerWebSocket, serve } from "bun";
import { Message } from "./model/message";

const encoder = new TextEncoder()

const server = serve({
  async fetch(req, server) {
    // upgrade the request to a WebSocket
    
    let username = new URL(req.url).searchParams.get("username")
    
    if (server.upgrade(req, {data: {username: username}})) {

      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    message(ws, messageText) {
      
      let message: Message = {
        date: new Date(),
        text: messageText.toString(),
        username: getUsername(ws)
      }
      
      ws.send(JSON.stringify(message))
      ws.publish("chat", JSON.stringify(message))
      
    },
    open(ws) {
      ws.subscribe("chat")
      console.log(getUsername(ws) + " Connected");
    },
    close(ws, code, message) {
      ws.sendText(getUsername(ws) + "Disconnected")
      ws.unsubscribe("chat")
    },
  }
});

const getUsername = (ws: ServerWebSocket<any>) => ws.data.username

console.log(`Listening on localhost:${server.port}`);