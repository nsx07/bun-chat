console.log(socket)
while (true) {
    let message = prompt("mensagem (type 'exit' to exit | 'close' to close socket): ")
    
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