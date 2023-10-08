import { BehaviorSubject, Observable, Subject } from "rxjs";
import { endpoints } from "../env/environment";
import { v4 } from "uuid"
import { ChatMessage, MessageBase, MessageType } from "../../../shared/model/message";

export class ChatService {

    private socket!: WebSocket;
    private _isConnect: boolean = false;
    private maxCloseTimeoutMilisBase100 = 100;
    private _connectedUsers: string[] = [];
    private _onClose: Subject<CloseEvent> = new Subject();
    private _onMessage: Subject<ChatMessage> = new Subject<ChatMessage>();
    private _messages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject(new Array<ChatMessage>());
    
    //#region GETTERS

    public get onMessage() {
        return this._onMessage.asObservable();
    }

    public get onClose() {
        return this._onClose.asObservable();
    }

    public get isConnect() {
        return this._isConnect;
    }

    public get messages() {
        return this._messages.getValue();
    }

    public get connectedUsers() {
        return this._connectedUsers;
    }

    public currentUsername() {
        return sessionStorage.getItem("username");
    }

    private get localStorageFlag () {
        return this.currentUsername()!;
    }

    private get params() {
        let username = sessionStorage.getItem("username");

        if (!username) {
            username = v4()
            sessionStorage.setItem("username", username)
        }

        return "?" + encodeURI(`username=${username}`);
    }

    private getMessages() {
        return sessionStorage.getItem(this.localStorageFlag)
    }

    //#endregion

    //#region Messages

    private allocMessage(message: MessageBase) {
        let previousMessages: string[] | string | null = this.getMessages()
        let messages: MessageBase[] = []

        if (previousMessages) {
            messages = Array.from(JSON.parse(previousMessages));
        }

        messages.push(message);
        sessionStorage.setItem(this.localStorageFlag, JSON.stringify(messages));

        return messages
    }

    public restoreMessages(): ChatMessage[] {
        let messages = this.getMessages();

        if (messages) {
            return Array.from(JSON.parse(messages));
        }

        return []
    }

    //#endregion

    //#region Actions

    public async connectChat() {
        return new Promise<Observable<MessageBase>>((res, rej) => {
            try {
                this.socket = new WebSocket(endpoints.apiWs + "/chat/connect" + this.params);
                
                this.socket.onopen = () => {
                    console.log("open");
                    
                    res(this.onMessage)
                    this.onConnect();
                }

                this.socket.onclose = (ev) => this.onDisconnect(ev)
                this.socket.onmessage = (ev) => this.__onMessage(ev)

            } catch (error) {
                rej(error)
            }
        });
    }

    public async disconnectChat() {
        if (!this.socket) {
            return;
        }


        return new Promise((res, rej) => {
            try {
                this.socket.close();
                let timeout = 0;
                let timer = setInterval(() => {
                    if (this.socket.readyState === this.socket.CLOSED) {
                        clearInterval(timer);
                        res(true);
                    }

                    timeout++;

                    if (timeout >= this.maxCloseTimeoutMilisBase100) {
                        clearInterval(timer);
                        throw new Error("Timeout to close websocket connection");
                    }
                }, this.maxCloseTimeoutMilisBase100);

            } catch (error) {
                rej(error)
            } finally {
                this._isConnect = false;
            }
        })
    }

    public sendMessage(content: string) {
        this.socket.send(content);
    }

    public testName(name: string) {
        return new Promise<boolean>((res) => {
            fetch(endpoints.apiHttp + "/user/testName?username=" + name)
                .then(result => result.json())
                .then(x => {
                    if (x.inUse) {
                        res(false)
                    } else {
                        res(true)
                    }
            })

        })  
    }

    //#endregion

    //#region EVENTS

    private onDisconnect(ev: CloseEvent) {
        this._isConnect = false;
        this._onClose.next(ev);
    }

    private onConnect() {
        this._isConnect = true;
    }

    private __onMessage(ev: MessageEvent) {
        let data: MessageBase;
        try {
            data = JSON.parse(ev.data)
            console.log(data);
            

            if (data.type === MessageType.ONLINE) {
                this._connectedUsers = [JSON.parse(data.text)];
                return;
            }


            this.allocMessage(data);
            this._onMessage.next(data as ChatMessage);
        } catch (error) {
            console.error("Error parsing message", ev.data)
        }
    }

    //#endregion

}