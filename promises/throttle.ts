export class Throttle {
    private _timeoutInstance: NodeJS.Timer | null;
    private _queue: (() => void)[];

    constructor(private timeout: number) {
        this._timeoutInstance = null;
        this._queue = [];
    }

    access() {
        const self = this;

        function setThrottleTimeout() {
            self._timeoutInstance = setTimeout(handleThrottleTimeout, self.timeout);
        }

        function handleThrottleTimeout() {
            const front = self._queue.shift();

            if (self._queue.length == 0) {
                self._timeoutInstance = null;
            } else {
                setThrottleTimeout();
            }

            if (front != undefined) {
                front();
            }
        }

        return new Promise<void>(function executor(resolve, reject) {
            if (self._timeoutInstance == null) {
                resolve();
                setThrottleTimeout();
            } else {
                self._queue.push(resolve);
            }
        });
    }
}
