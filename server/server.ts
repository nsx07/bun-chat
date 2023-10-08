import { ServerWebSocket, env, serve } from "bun";
import { chatRoute } from "./routes/chat";
import { defaultHeaders } from "./core/headers";
import { userRoute } from "./routes/user";
import { stripPath } from "./core/stripURL";
import { closeHandler, messageHandler, openHandler } from "./websocket/handler";

export const connected = new Map<string, ServerWebSocket<any>>()

export const routes = {
  chat: chatRoute,
  user: userRoute
}

const server = serve({
  // serverName: "BunChatServer",
  async fetch(req, server) {

    let url = new URL(req.url);
    let path = stripPath(url.pathname)[0];

    console.log(url.pathname);
    
    if (path && path in routes) {
      return routes[path](url, req, server);
    }
    
    if (url.pathname === "/") {
      return new Response("Hello World!", { status: 200 });
    }

    return new Response("Not Found", {
      status: 404,
      ...defaultHeaders
    })

  },
  websocket: {
    open: openHandler,
    close: closeHandler,
    message: messageHandler,
  },
  port: env["PORT"] ?? 3000
});


console.log(`Listening on ${server.hostname}:${server.port}`);