let socket = new WebSocket("ws://localhost:3000/chat");
let myMessages = [];
let messages = [];
let flag = null 


socket.onmessage = ev => write(ev.data);
socket.onclose = () => process.exit()

const write = (msg: string | Buffer) => {
  
  messages.push(msg);
  messages.forEach(x => Bun.write(Bun.stdout, myMessages.includes(x) ? "\n\t\t\t\t\t" + x : x + "\n\r"))
}

let timer = 0;
let runner = setInterval(() => {
  let message = prompt("mensagem (type 'exit' to exit | 'close' to close socket): ");
      
  if (message === "exit") {
    socket.close();
    process.exit();
  } else if (message === "close") {
    socket.close()
  } else if (message === "open") {
    socket = new WebSocket("ws://localhost:3000/chat");
  } else {
    myMessages.push(message)
    socket.send(message);
  }
  
}, timer);
