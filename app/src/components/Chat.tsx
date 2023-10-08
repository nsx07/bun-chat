import clsx from 'clsx';
import { ChatService } from '../services/chat-service';
import { useEffect, useRef, useState } from 'react';
import { Person } from 'phosphor-react';
import { MessageBox, SystemMessage } from 'react-chat-elements';
import { ChatMessage, MessageType } from '../model/message';
import InputMessage from './InputMessage';
import { v4 as uuidv4 } from 'uuid';


export interface Props {
  chatService: ChatService,
  ready: boolean
}

function Chat({chatService, ready}: Props) {
  let [connected, setConnected] = useState(false);
  let [connecteds, setConnecteds] = useState(chatService.connectedUsers);
  let username = chatService.currentUsername() ?? "";
  let [message, setMessage] = useState<ChatMessage[]>(chatService.restoreMessages());
  let messageContainerRef = useRef(null);

  useEffect(() => {
    if (!connected) {
      chat()
    }

  }, [ready])

  function handlePress(message: string) {
    chatService.sendMessage(message)
  }

  function itsMy(user:string) {
    return user === username;
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      //@ts-ignore
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }

    setConnecteds(chatService.connectedUsers);
  }, [message, chatService.connectedUsers]);

  useEffect(() => {
    return () => {
      if (chatService && connected) {
        chatService.disconnectChat();
      }
    };
  }, []);

  async function chat() {
    setConnected(chatService.isConnect);
    
    chatService.onMessage.subscribe(x => {
      console.log(x);
      
      message = [...message, x]      
      setMessage(message);
    })

    chatService.onClose.subscribe(() => {
      setConnected(false);
    })
    
  }

  return (
    <>
  <div className='sticky rounded-sm top-0 w-full bg-slate-200 text-gray-700 p-2 z-10'>
    <div className='grid grid-cols-6'>
      <div className='text-left leading-relaxed flex justify-start gap-2 items-center' onClick={() => {
        if (!connected) {
          chatService.connectChat()
        }
      }}>
        <span className={clsx("rounded-full border-zinc-100 p-1", { 
              "bg-green-500": connected, 
              "bg-red-500": !connected 
             })}>
        </span>
        
        <span className='font-semibold'>
          {connected ? "online" : "offline"}
        </span>
      </div>
      <div className='col-span-4 flex flex-col w-full'>
        <div className='text-center leading-relaxed'>
          <span className='font-semibold leading-relaxed'>BunChat</span>
        </div>
        <div className='leading-relaxed text-sm max-w-2xl overflow-ellipsis whitespace-nowrap'>
          {
            ready 
            ? (
              <span>{connecteds.join(",  ")}</span>
            )
            : "Loading..."
          }
        </div>
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
    </>
  )
}

export default Chat;
