import { useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';
import { MessageBox } from 'react-chat-elements'
import { v4 as uuidv4 } from 'uuid';


const chatService = new ChatService();
let messages : string[] = []

function App() {
  const [message, setMessage] = useState<string[]|null>(null);
  const [connected, setConnected] = useState(false);

  async function chat() {
    await chatService.connectChat();

    setConnected(true);

    chatService.onMessage.subscribe(x => {
      messages.push(x)
      setMessage(messages);
      console.log(messages);
      
    })

    chatService.onClose.subscribe(x => {
      setConnected(false);
      console.log(x);
      
    })
    
  }

  return (
    <>
      <div style={{height: "100vh", display: "flex", width: "100%", justifyContent: "center",}}>
        <div style={{height: "100%", width: "50%", display: "flex", flexDirection: "column", justifyContent:"space-between"}}>
          <div className="card" style={{display: "flex", width: "max-content", alignItems: "center"}}>
            <button onClick={() => !connected ? chat() : void 0} disabled={connected}>
              Connect chat
            </button>
            <button onClick={() => connected ? chatService.disconnectChat() : void 0} disabled={!connected}>
              Disconnect chat
            </button>
            <span style={{marginLeft: '1rem'}}>
              {connected ? "Conectado" : "Desconectado"}
            </span>
          </div>

          <div className='card'>
            {message && message.map((x, i) => {
              const key = uuidv4();
              
              return (
                <div key={key}>
                  <MessageBox
                      id={key}
                      focus={true}
                      titleColor={'#333'}
                      forwarded={true}
                      notch={true}
                      removeButton={false}
                      replyButton={true}
                      status={'waiting'}
                      retracted={true}
                      position={"left"}
                      type={"text"}
                      title={""}
                      text={x}
                      date={new Date()}
                    />
                </div>
              )
            })}
          </div>

          <div className="card">
            <InputMessage  onEnter={(message) => chatService.sendMessage(message)}></InputMessage>
            
          </div>
        </div>

      </div>
      
    </>
  )
}

export default App
