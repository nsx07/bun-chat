import { useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';
import { MessageBox } from 'react-chat-elements'
import { v4 as uuidv4 } from 'uuid';

const chatService = new ChatService();
const myMessages: string[] = [];

function itsMy(men:string) {
  return myMessages.includes(men);
}

function App() {
  let [message, setMessage] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  async function chat() {
    await chatService.connectChat();

    setConnected(true);

    chatService.onMessage.subscribe(x => {
      message = [...message, x]
      setMessage(message);
    })

    chatService.onClose.subscribe(x => {
      setConnected(false);
    
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

          <div className='card' style={{display: "flex", flexDirection:"column", width: "100%", gap: "0.3rem"}}>
            {message && message.map((x) => {
              const key = uuidv4();
              
              return (
                <div key={`${key}`} >
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
                      position={itsMy(x) ? "right" : "left"}
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
            <InputMessage  onEnter={(message) => {
              myMessages.push(message)
              chatService.sendMessage(message)
            }}></InputMessage>
            
          </div>
        </div>

      </div>
      
    </>
  )
}

export default App
