import { Server } from "bun";
import { defaultHeaders } from "../core/headers";
import { connected } from "../server";
import { stripPath } from "../core/stripURL";

const routes = {
    testName: testName,
}

export function userRoute(url: URL, req: Request, server: Server) {
    let path = stripPath(url.pathname)[1];
    
    if (!path || !(path in routes)) {
        return new Response("Not Found", {
            status: 404,
            ...defaultHeaders
        });
    }
    
    return routes[path](url, req, server)
}

function testName (url: URL, req: Request, server: Server) {
    let username = url.searchParams.get("username")
    return new Response(JSON.stringify({inUse: connected.has(username)}), 
    { 
      status: 200,
      ...defaultHeaders
    });
}