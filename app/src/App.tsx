import { useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';
import { MessageBox } from 'react-chat-elements'
import { v4 as uuidv4 } from 'uuid';
import "./styles/index.css";
import { Message } from './model/message';

const chatService = new ChatService();



function App() {
  let [message, setMessage] = useState<Message[]>([]);
  let [connected, setConnected] = useState(false);

  async function chat() {
    await chatService.connectChat();

    setConnected(true);

    chatService.onMessage.subscribe(x => {
      console.log(x);
      
      message = [...message, x]      
      setMessage(message);
    })

    chatService.onClose.subscribe(() => {
      setConnected(false);
    })
    
  }

  function handlePress(message: string) {
    chatService.sendMessage(message)
  }

  function itsMy(user:string) {
    return user === chatService.currentUsername();
  }

  return (
    <>
        <div className='w-screen h-screen relative bg-slate-700 flex justify-center'>
          <div className='w-1/2 relative'>

            <div className='absolute top-0 w-full bg-slate-950 text-slate-50 p-2 h-8'>
              <button onClick={() => !connected ? chat() : void 0} disabled={connected}>
                Connect chat
              </button>
              <button onClick={() => connected ? chatService.disconnectChat() : void 0} disabled={!connected}>
                Disconnect chat
              </button>
              <span>
                {connected ? "Conectado" : "Desconectado"}
              </span>
            </div>

            <div className='h-screen w-full py-8 overflow-y-auto overflow-x-hidden'>
              <div className='w-full py-2'>
                {message && message.map((x) => {
                  const key = uuidv4();
                  
                  return (
                    <div key={`${key}`} style={{accentColor:"GrayText", color: "#1f1f1f"}}>
                      <MessageBox
                          id={key}
                          text={x.text}
                          title={x.username}
                          notch={true}
                          focus={false}
                          type={"text"}
                          status={'sent'}
                          forwarded={true}
                          retracted={true}
                          date={x.date}
                          replyButton={true}
                          titleColor={'#333'}
                          removeButton={false}
                          position={itsMy(x.username) ? "right" : "left"}
                        />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='absolute bottom-0 w-full'>
              <InputMessage  onEnter={(message) => handlePress(message)} disabled={!connected}></InputMessage>
            </div>
            
          </div>
        </div>
    </>
  )
}

export default App