import { ServerWebSocket, serve } from "bun";

const server = serve({
  async fetch(req, server) {
    // upgrade the request to a WebSocket
    
    let username = Date.now() * Math.sqrt((Math.random() * Math.random() / Math.PI))
    
    if (server.upgrade(req, {data: {username: username}})) {

      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      console.log(message);
      
      ws.sendText(message.toString())
      ws.publishText("chat", message.toString())
      
    },
    open(ws) {
      ws.subscribe("chat")
      console.log(getUsername(ws) + " Connected");
      
      ws.sendText(getUsername(ws) + " Connected")
    },
    close(ws, code, message) {
      ws.sendText(getUsername(ws) + "Disconnected")
      ws.unsubscribe("chat")
    },
  }
});

const getUsername = (ws: ServerWebSocket<any>) => ws.data.username

console.log(`Listening on localhost:${server.port}`);