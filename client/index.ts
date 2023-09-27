import { Mutex } from "async-mutex";
import * as readline from "readline";


Bun.spawnSync({cmd: ["clear"]});
let socket = new WebSocket("ws://localhost:3000/chat");;
let mtx = new Mutex();
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
let myMessages: string[] = [];
let messages: string[] = [];



const write = (msg: string | Buffer) => {
  messages.push(msg.toLocaleString());
  messages.forEach(x => {
    rl.write(myMessages.some(y => y.includes(x)) ? `\t${x}\n` : `${x}\n`)
  })
}

async function menuLoop() {
  while (true) {
    let message = await getUserInput("mensagem (type 'exit' to exit | 'close' to close socket): ");
    
    if (message === "exit") {
      socket.close();
      process.exit();
    } else if (message === "close") {
      socket.close()
    } else if (message === "open") {
      socket = new WebSocket("ws://localhost:3000/chat");
    } else if (message && message.length >= 2) {
      myMessages.push(message)
      socket.send(message);
    }
  }
}

async function socketLoop() {
  socket.onmessage = async (ev) => {
    await mtx.runExclusive(async () => write(ev.data))
  }
  socket.onclose = () => process.exit()
}

function getUserInput(promptM: string) {
  return new Promise<string>((resolve) => {
    rl.prompt(true)
    rl.question(promptM, (answer) => {
      resolve(answer);
      console.clear()
    });
  });
}

socket.onopen = ev => {
  console.log("[ Started ]");
  
  socketLoop();
  menuLoop();
}
