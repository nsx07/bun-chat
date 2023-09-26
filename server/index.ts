import { ServerWebSocket, serve } from "bun";

const server = serve({
  async fetch(req, server) {
    // upgrade the request to a WebSocket
    
    let username = Date.now() * Math.sqrt((Math.random() * Math.random() / Math.PI))
    console.log(username);
    
    if (server.upgrade(req, {data: username})) {

      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      ws.sendText(getUsername(ws) + " " + message.toString())
      console.log(message);
      
    }, // a message is received
    open(ws) {
      ws.subscribe("chat")
      ws.sendText(getUsername(ws) + " Connected")
    }, // a socket is opened
    close(ws, code, message) {
      ws.sendText(getUsername(ws) + "Disconnected")
      ws.unsubscribe("chat")
    }, // a socket is closed
  }
});

const getUsername = (ws: ServerWebSocket<any>) => (ws.data as any).username

console.log(`Listening on localhost:${server.port}`);