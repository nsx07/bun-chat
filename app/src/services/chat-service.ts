import { BehaviorSubject, Observable, Subject } from "rxjs";
import { endpoints } from "../env/environment";

export class ChatService {

    private socket!: WebSocket;
    private isConnect: boolean = false;
    private _onClose: Subject<CloseEvent> = new Subject();
    private _onMessage: Subject<string> = new Subject<string>();
    private messages: BehaviorSubject<string[]> = new BehaviorSubject([`${new Date().toISOString()} - Chat iniciado`]);

    get onMessage() {
        return this._onMessage.asObservable();
    }

    get onClose() {
        return this._onClose.asObservable();
    }

    async connectChat() {
        return new Promise<Observable<string>>((res, rej) => {
            this.socket = new WebSocket(endpoints.apiWs + "/chat");

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

    sendMessage(content: string) {
        this.socket.send(content);
    }

}