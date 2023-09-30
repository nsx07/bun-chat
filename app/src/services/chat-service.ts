import { BehaviorSubject, Observable, Subject } from "rxjs";
import { endpoints } from "../env/environment";
import { v4 } from "uuid"
import { Message } from "../model/message";

export class ChatService {

    private socket!: WebSocket;
    private maxCloseTimeoutMilisBase100 = 100;
    public _isConnect: boolean = false;
    private _onClose: Subject<CloseEvent> = new Subject();
    private _onMessage: Subject<Message> = new Subject<Message>();
    private _messages: BehaviorSubject<Message[]> = new BehaviorSubject(new Array<Message>());

    get onMessage() {
        return this._onMessage.asObservable();
    }

    get onClose() {
        return this._onClose.asObservable();
    }

    get isConnect() {
        return this._isConnect;
    }

    get messages() {
        return this._messages.getValue();
    }

    public currentUsername() {
        return sessionStorage.getItem("username");
    }

    private get params() {
        let username = sessionStorage.getItem("username");

        if (!username) {
            username = v4()
            sessionStorage.setItem("username", username)
        }

        return "?" + encodeURI(`username=${username}`);
    }

    public async connectChat() {
        return new Promise<Observable<Message>>((res, rej) => {
            try {
                this.socket = new WebSocket(endpoints.apiWs + "/chat" + this.params);
                
                this.socket.onopen = () => res(this.onMessage)
                this.socket.onclose = (ev) => this._onClose.next(ev)
                this.socket.onmessage = (ev) => {
                    let data: Message;
                    try {
                        data = JSON.parse(ev.data)
                        this._onMessage.next(data);
                    } catch (error) {
                        console.error("Error parsing message", ev.data)
                    }
                }

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
        return new Promise<boolean>((res, rej) => {

            fetch(endpoints.apiHttp + "/testName?username=" + name)
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

}