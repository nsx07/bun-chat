import { Server } from "bun";
import { connected } from "../server";
import { defaultHeaders } from "../core/headers";
import { stripPath } from "../core/stripURL";

const routes = {
    connect: connect,
    connecteds: whoIsOnline
}

export function chatRoute(url: URL, req: Request, server: Server) {
    let path = stripPath(url.pathname)[1];
    
    if (!path || !(path in routes)) {
        return new Response("Not Found", {
            status: 404,
            ...defaultHeaders
        });
    }
    
    return routes[path](url, req, server)
}

function connect(url: URL, req: Request, server: Server) {
    let username = url.searchParams.get("username")

    if (connected.has(username)) {
      console.log(username + "Already Connected");
      return new Response("User already connected :(", { status: 500 });
    }

    if (server.upgrade(req, { data: {username: username}})) {
      return;
    }

    return new Response("Upgrade failed :(", { status: 500 });
}

function whoIsOnline(url: URL, req: Request, server: Server) {
    let username = url.searchParams.get("username")
}