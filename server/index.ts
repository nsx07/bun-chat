import { ServerWebSocket, env, serve } from "bun";
import { Message, MessageType } from "./model/message";

const encoder = new TextEncoder()
const connected = new Map<string, ServerWebSocket<any>>()

const server = serve({
  async fetch(req, server) {

    let url = new URL(req.url);
    console.log(url.pathname);
    
    
    if (url.pathname === "/chat") {
      let username = url.searchParams.get("username")

      if (connected.has(username)) {
        console.log(username + "Already Connected");
        return new Response("User already connected :(", { status: 500 });
      }

      if (server.upgrade(req, {data: {username: username}})) {
        return;
      }
      return new Response("Upgrade failed :(", { status: 500 });
    }

    if (url.pathname === "/testName") {
      return new Response(JSON.stringify({inUse: connected.has(url.searchParams.get("username"))}), 
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      });
    }

    if (url.pathname === "/") {
      return new Response("Hello World!", { status: 200 });
    }
      
  },
  websocket: {
    message(ws, messageText) {
      
      let message: Message = {
        date: new Date(),
        type: MessageType.TEXT,
        text: messageText.toString(),
        username: getUsername(ws)
      }
      
      ws.send(JSON.stringify(message))
      ws.publish("chat", JSON.stringify(message))
      
    },
    open(ws) {
      ws.subscribe("chat")

      let username = getUsername(ws)
      let message: Message = {
        date: new Date(),
        type: MessageType.INFO,
        text: `${username} has joined the chat`,
        username: getUsername(ws)
      }

      ws.publish("chat", JSON.stringify(message));
      connected.set(username, ws);
      console.log(username + " Connected");
    },
    close(ws, code, message_) {
      let username = getUsername(ws);
      connected.delete(username);
      ws.unsubscribe("chat");
      
      let message: Message = {
        date: new Date(),
        type: MessageType.INFO,
        text: `${username} has exited the chat`,
        username: getUsername(ws)
      }
      
      console.log(Array.from(connected.keys()));

      connected.forEach(socket => {
        socket.send(JSON.stringify(message))
      })
      
      
      console.log(username + " Disconnected");
    },
  },
  port: env["PORT"] ?? 3000
});

const getUsername = (ws: ServerWebSocket<any>) => ws.data.username

console.log(`Listening on ${server.hostname}:${server.port}`);
