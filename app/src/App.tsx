import { CSSProperties, useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';
import { MessageBox } from 'react-chat-elements'
import { v4 as uuidv4 } from 'uuid';

const chatService = new ChatService();



function App() {
  let [message, setMessage] = useState<string[]>([]);
  let [myMessage, setMyMessage] = useState<string[]>([]);
  let [connected, setConnected] = useState(false);

  async function chat() {
    await chatService.connectChat();

    setConnected(true);

    chatService.onMessage.subscribe(x => {
      console.log(x);
      
      message = [...message, x]      
      setMessage(message);
    })

    chatService.onClose.subscribe(x => {
      setConnected(false);
    })
    
  }

  function handlePress(message: string) {
    myMessage = [...myMessage, message];
    setMyMessage(myMessage);
    chatService.sendMessage(message)
  }

  function itsMy(men:string) {
    return myMessage.includes(men);
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
              {message && message.map((x, i) => {
                const key = uuidv4();
                
                return (
                  <div key={`${key}`} style={{accentColor:"GrayText", color: "#1f1f1f"}}>
                    <MessageBox
                        id={key}
                        text={x}
                        title={x}
                        notch={true}
                        focus={false}
                        type={"text"}
                        status={'sent'}
                        forwarded={true}
                        retracted={true}
                        date={new Date()}
                        replyButton={true}
                        titleColor={'#333'}
                        removeButton={false}
                        position={itsMy(x) ? "right" : "left"}
                      />
                  </div>
                )
              })}
            </div>

            <div style={styles.input}>
              <InputMessage  onEnter={(message) => handlePress(message)} disabled={!connected}></InputMessage>
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
    width: "max-content",
    maxWidth: "100%",
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
    width: "100%"
  }
}