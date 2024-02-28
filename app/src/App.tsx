import { useState } from 'react'
import { ChatService } from './services/chat-service';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowsCounterClockwise,  } from 'phosphor-react';
import * as Toast from '@radix-ui/react-toast';
import * as rw from "random-words"
import "./styles/index.css";
import Input from './components/Input';
import Chat from './components/Chat';

const chatService = new ChatService();
const generateName = () => {
  return rw.generate(2).join("-")
}

function App() {
  let [username, setUsername] = useState<string>(chatService.currentUsername()! ?? "");
  let [resetUser, setResetUser] = useState(username && username != "");
  let [openToast, setOpenToast] = useState(false);
  let [loading, setLoading] = useState(false);
  let [open, setOpen] = useState(true);


  function saveUsername(name: string) {
    setLoading(true);
    chatService.testName(name).then(async x => {
      if (x) {

        console.log(x);
        
        sessionStorage.setItem("username", name.trimEnd());
        setUsername(name.trimEnd());

        await chatService.connectChat();
        console.log(chatService.isConnect);
        
        setOpen(false);
      } else {
        setOpenToast(true);
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
        <div className='isolate w-screen h-screen relative bg-slate-950 flex justify-center'>
          
          <div className="absolute inset-x-0 top-[-10rem] -z-9 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem] max-h-screen" aria-hidden="true">
            <div className="relative right-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00adb4] to-[#00adb4] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} ></div>
          </div>

          <div className='md:w-1/2 sm:w-2/3 w-[calc(100%)] relative bg-slate-950 z-10'>

            <Chat ready={!open} chatService={chatService}/>
            
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

        <Dialog.Root open={open} onOpenChange={() => null} modal={true}>
            <Dialog.Portal >
              <Dialog.DialogOverlay className="w-screen h-screen bg-black/80 fixed inset-0 cursor-not-allowed" onClick={(x) => x.preventDefault()}/>

              <Dialog.DialogContent className="absolute p-6 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                
                <Dialog.DialogTitle className="text-3xl mb-3 leading-tight text-slate-200 font-extrabold flex gap-2">
                  BunChat 
                  <ArrowsCounterClockwise className="cursor-pointer" size={32} onClick={() => {
                      setUsername(generateName())
                    }}/>
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
                        <label htmlFor="username" className='text-slate-50 font-semibold leading-3'>Username</label>
                          <Input
                            disabled={loading}
                            onEnter={x => saveUsername(x)} 
                            onChange={setUsername}
                            valor={username}
                            inputId='username'
                          />
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
