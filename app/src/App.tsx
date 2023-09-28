import { CSSProperties, useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';
import { MessageBox } from 'react-chat-elements'
import { v4 as uuidv4 } from 'uuid';

const chatService = new ChatService();
const myMessages: string[] = [];

function itsMy(men:string) {
  return myMessages.map(x => x.substring(x.indexOf(" "))).some(x => men === men);
}

function App() {
  let [message, setMessage] = useState<string[]>([]);
  let [connected, setConnected] = useState(false);

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
        <div style={styles.wrapper}>
          <div style={styles.chat}>
            <div style={styles.header}>
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

            <div style={styles.message}>
              {message && message.map((x) => {
                const key = uuidv4();
                
                return (
                  <div key={`${key}`} >
                    <MessageBox
                        id={key}
                        focus={false}
                        titleColor={'#333'}
                        forwarded={true}
                        notch={true}
                        removeButton={false}
                        replyButton={true}
                        status={'sent'}
                        retracted={true}
                        position={itsMy(x) ? "right" : "left"}
                        type={"text"}
                        title={x.substring(0, x.indexOf(" "))}
                        text={x.substring(x.indexOf(" "))}
                        date={new Date()}
                      />
                  </div>
                )
              })}
            </div>

            <div style={styles.input}>
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

const styles : Record<string, CSSProperties>= {
  wrapper: {
    width: "100vw",
    height: "100vh",
    position:"relative",
    display: "flex",
    justifyContent:"center"
  },
  chat: {
    // width: "50%",
    // padding:"1rem",
    height: "100%",
    position: "relative"
  },
  header: {
    position:'sticky',
    background: "#1f1f1f",
    zIndex: 1001,
    height: "2vh",
    // top: "0",
    // left: "0"
  },
  message: {
    height: "90vh",
    overflowX:'hidden',
    overflowY: 'auto',
    scrollBehavior: "smooth",
    
  },
  input: {
  }
}