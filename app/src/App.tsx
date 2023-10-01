import { useEffect, useRef, useState } from 'react'
import { ChatService } from './services/chat-service';
import InputMessage from './components/InputMessage';
import { MessageBox, SystemMessage } from 'react-chat-elements'
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageType } from './model/message';
import * as Dialog from '@radix-ui/react-dialog';
import { Person, X } from 'phosphor-react';
import * as Toast from '@radix-ui/react-toast';
import * as rw from "random-words"
import "./styles/index.css";
import clsx from 'clsx';

const chatService = new ChatService();
const generateName = () => {
  return rw.generate(2).join("-")
}

function App() {
  let [username, setUsername] = useState<string>(chatService.currentUsername()!);
  let [resetUser, setResetUser] = useState(username && username != "");
  let [message, setMessage] = useState<Message[]>([]);
  let [connected, setConnected] = useState(false);
  let [openToast, setOpenToast] = useState(false);
  let messageContainerRef = useRef(null);
  let [open, setOpen] = useState(true);

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
    return user === username;
  }

  function saveUsername(name: string) {
    chatService.testName(name).then(x => {
      if (x) {
        sessionStorage.setItem("username", name.trimEnd());
        setUsername(name.trimEnd());
        chat().then(() => {
          setOpen(false);
        });
      } else {
        setOpenToast(true);
      }
    });
  }

  useEffect(() => {
    // Alguma inicialização

    return () => {
      // Realize ações de limpeza quando o componente for desmontado
      // Por exemplo, cancelar assinaturas, liberar recursos, etc.
      if (chatService && connected) {
        chatService.disconnectChat();
      }
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      //@ts-ignore
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [message]);

  return (
    <>
        <div className='isolate w-screen h-screen relative bg-slate-950 flex justify-center'>
          
          <div className="absolute inset-x-0 top-[-10rem] -z-9 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem] max-h-screen" aria-hidden="true">
            <div className="relative right-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00adb4] to-[#00adb4] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} ></div>
          </div>

          <div className='md:w-1/2 sm:w-2/3 w-[calc(100%)] relative bg-slate-950 z-10'>

            <div className='sticky rounded-sm top-0 w-full bg-slate-200 text-gray-700 p-2 z-10'>
              <div className='grid grid-cols-3'>
                <div className='text-left leading-relaxed flex justify-start gap-2 items-center'>
                  <span className={clsx("rounded-full border-zinc-100 p-1", { 
                        "bg-green-500": connected, 
                        "bg-red-500": !connected 
                       })}>
                  </span>
                  
                  <span className='font-semibold'>
                    {connected ? "online" : "offline"}
                  </span>
                </div>
                <div className='text-center leading-relaxed'>
                  <span className='font-semibold leading-relaxed'>BunChat</span>
                </div>
                <div className='text-right leading-relaxed flex justify-end gap-2 items-center'>
                  <span className='font-semibold'>{
                    username ? username : ""
                  }</span>
                  <Person />
                </div>
              </div>
            
            </div>

            <div className="h-[calc(100vh-6rem)] p-2 overflow-auto">
              <div className='h-full w-full overflow-y-auto scroll-smooth overflow-x-hidden' ref={messageContainerRef}>
                <div className='w-full'>
                  {message && message.map((x) => {
                    const key = uuidv4();
                    
                    return (
                      <div key={`${key}`}>

                        {x.type === MessageType.TEXT ? (
                          <MessageBox
                              id={key}
                              text={x.text}
                              notch={true}
                              
                              focus={false}
                              type={"text"}
                              date={x.date}
                              status={'sent'}
                              forwarded={false}
                              retracted={false}
                              title={x.username}
                              replyButton={false}
                              titleColor={'#000'}
                              removeButton={false}
                              position={itsMy(x.username) ? "right" : "left"}
                            />
                          ) : (
                          <SystemMessage 
                              id={key}
                              notch={true}
                              text={x.text}
                              focus={false}
                              type={"text"}
                              date={x.date}
                              status={'sent'}
                              forwarded={false}
                              retracted={false}
                              title={x.username}
                              replyButton={false}
                              titleColor={'#000'}
                              removeButton={false}
                              position={"center"}/>
                          )}


                      </div>
                      
                    )
                  })}
                </div>
              </div>
            </div>

            <div className='absolute bottom-0 w-full p-2 bg-opacity-50 bg-slate-'>
              <InputMessage onEnter={(message) => handlePress(message)} disabled={!connected}></InputMessage>
            </div>
            
          </div>

          <div className="absolute inset-x-0 top-[-10rem] -z-9 transform-gpu overflow-hidden blur-3xl sm:top-[-2rem] max-h-screen" aria-hidden="true">
            <div className="relative left-[calc(50%+4rem)] -z-12 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#00adb4] to-[#00adb4] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
          </div>

        </div>

        <Toast.Provider swipeDirection="right">
          <Toast.Root className="ToastRoot bg-opacity-50 bg-red-600" open={openToast} onOpenChange={setOpenToast}>
            <Toast.Title className="ToastTitle">
              Username already in use
            </Toast.Title>
            <Toast.Description asChild>
              <p className="ToastDescription">
                Try another username, what about <code>{rw.generate(2).join("-")}?</code>
              </p>
            </Toast.Description>
          </Toast.Root>
          <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>

        <Dialog.Root open={open} onOpenChange={() => username && username != "" ? saveUsername(username): void 0} modal={true}>
            <Dialog.Portal >
              <Dialog.DialogOverlay className="w-screen h-screen bg-black/80 fixed inset-0 cursor-not-allowed" onClick={(x) => x.preventDefault()}/>

              <Dialog.DialogContent className="absolute p-6 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                
                <Dialog.DialogTitle className="text-3xl mb-3 leading-tight text-slate-200 font-extrabold">
                  BunChat
                </Dialog.DialogTitle>

                {
                  resetUser
                  ? (
                      <>
                        <div>
                          <p className="text-md mb-3 text-slate-200">
                            Nome de usuário detectado ({username}), deseja usar o mesmo?
                          </p>
                          <div className="flex justify-between gap-2">
                            <button className='cursor-pointer p-2 text-center rounded-md w-full bg-green-900 text-slate-50' onClick={() => saveUsername(username)}>Sim</button>
                            <button className='cursor-pointer p-2 text-center rounded-md w-full bg-red-900 text-slate-50' onClick={() => setResetUser(false)}>Não</button>
                          </div>
                        </div>
                      </>
                  )
                  : (
                      <>
                        <InputMessage initialValue={generateName()} onEnter={x => saveUsername(x)} placeholder='Username'></InputMessage>
                      </>
                  )
                }
                
              </Dialog.DialogContent>
            </Dialog.Portal>
        </Dialog.Root>
    </>
  )
}

export default App