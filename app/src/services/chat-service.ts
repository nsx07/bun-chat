import { BehaviorSubject, Observable, Subject } from "rxjs";
import { endpoints } from "../env/environment";
import { v4 } from "uuid"

export class ChatService {

    private socket!: WebSocket;
    private maxCloseTimeoutMilisBase100 = 100;
    public _isConnect: boolean = false;
    private _onClose: Subject<CloseEvent> = new Subject();
    private _onMessage: Subject<string> = new Subject<string>();
    private _messages: BehaviorSubject<string[]> = new BehaviorSubject([`${new Date().toISOString()} - Chat iniciado`]);

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

    private get params() {
        let username = sessionStorage.getItem("username");

        if (!username) {
            username = v4()
            sessionStorage.setItem("username", username)
        }

        return encodeURI(`username=${username}`);
    }

    public async connectChat() {
        return new Promise<Observable<string>>((res, rej) => {
            this.socket = new WebSocket(endpoints.apiWs + "/chat" + this.params);

            this.socket.onmessage = (ev) => {
                this._onMessage.next(ev.data);
            }

            this.socket.onopen = (ev) => {
                res(this.onMessage)
                return;
            }

            this.socket.onclose = (ev) => {
                this._onClose.next(ev);
            }
        });
    }

    public async disconnectChat() {
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

}