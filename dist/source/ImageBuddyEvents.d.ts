export default class {
    static on(event: string, listener: CallableFunction): void;
    static emit(event: string, ...args: any[]): void;
}
