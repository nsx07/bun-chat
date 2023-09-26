let socket = new WebSocket("ws://localhost:3000/chat");
let messages = []
let myMessages = []

socket.onopen = (ev) => {
  console.log("ping");
  socket.addEventListener("message", event => {
    messages.push(event.data);
    write();
  })
  
  const write = () => {
      messages.forEach(x => {
        Bun.write(Bun.stdout, myMessages.includes(x) ? "\n\t\t\t\t\t" + x : x + "\n\r")
      })
  }
  
  for (;;) {
  
    let message = prompt("mensagem (type 'exit' to exit | 'close' to close socket): ");
  
    if (message === "exit") {
      break;
    } else if (message === "close") {
      socket.close()
    } else if (message === "open") {
      socket = new WebSocket("ws://localhost:3000/chat");
    } else {
      myMessages.push(message)
      socket.send(message);
    }
  
  }

}
