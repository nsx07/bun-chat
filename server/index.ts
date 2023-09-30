import { ServerWebSocket, serve } from "bun";
import { Message } from "./model/message";

const encoder = new TextEncoder()

const server = serve({
  async fetch(req, server) {

    let url = new URL(req.url);

    if (url.pathname === "/chat") {
      let username = url.searchParams.get("username")
      if (server.upgrade(req, {data: {username: username}})) {
        return;
      }
      return new Response("Upgrade failed :(", { status: 500 });
    }

    if (url.pathname === "/") {
      return new Response("Hello World!", { status: 200 });
    }
      
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
  },
  port: 4000
});

const getUsername = (ws: ServerWebSocket<any>) => ws.data.username

console.log(`Listening on ${server.hostname}:${server.port}`);
