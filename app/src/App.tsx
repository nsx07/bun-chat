import { useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';

const chatService = new ChatService();
let messages : string[] = []

function App() {
  const [message, setMessage] = useState([""]);
  const [connected, setConnected] = useState(false);

  async function chat() {
    await chatService.connectChat();

    setConnected(true);

    chatService.onMessage.subscribe(x => {
      messages.push(x)
      setMessage(messages);
    })

    chatService.onClose.subscribe(x => {
      setConnected(false);
    })
    
  }

  return (
    <>
      <div className="card">
        <button onClick={() => !connected ? chat() : void 0} disabled={connected}>
          Connect chat
        </button>

        <span style={{marginLeft: '1rem'}}>
          {connected ? "Conectado" : "Desconectado"}
        </span>
      </div>

      <div className="card">
        <InputMessage onEnter={(message) => {
          console.log(message);
          chatService.sendMessage(message)
          }}></InputMessage>
      </div>
      
    </>
  )
}

export default App
