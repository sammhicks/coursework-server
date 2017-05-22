
interface WaitingLock {
    lock?: Lock;
    doLock: () => void
}

export class Mutex {
    private _isLocked: boolean;
    private _currentLock: Lock | null | undefined;
    private _waitingLocks: WaitingLock[];

    constructor() {
        this._isLocked = false;
        this._currentLock = null;
        this._waitingLocks = [];
    }

    lock(lock?: Lock): Promise<void> {
        const self = this;
        return new Promise<void>(function executor(resolve, reject) {
            if (self._isLocked) {
                self._waitingLocks.push({ lock: lock, doLock: resolve });
            } else {
                self._isLocked = true;
                self._currentLock = lock;
                resolve();
            }
        });
    }

    unlock(lock?: Lock): Promise<void> {
        if (!this._isLocked) {
            return Promise.reject(new Error("Mutex is not locked"));
        } else if (this._currentLock !== lock) {
            return Promise.reject(new Error("Mutex is locked by another lock"));
        } else {
            const nextLock = this._waitingLocks.shift();

            if (nextLock === undefined) {
                this._isLocked = false;
                this._currentLock = undefined;
            } else {
                this._currentLock = nextLock.lock;
                nextLock.doLock();
            }

            return Promise.resolve();
        }
    }
}

export class Lock {
    private _mutex: Mutex;

    constructor(mutex: Mutex) {
        this._mutex = mutex;
    }

    lock<InType, OutType>(action: (parameter: InType) => Promise<OutType>): (parameter: InType) => Promise<OutType> {
        const self = this;
        return function doLock(parameter: InType): Promise<OutType> {
            return self._mutex.lock(self).then(function insideLock(): Promise<OutType> {
                return action(parameter).then(function doResolveUnlock(result: OutType) {
                    return self._mutex.unlock(self).then(() => result);
                }, function doRejectUnlock(error: any) {
                    return self._mutex.unlock(self).then(() => Promise.reject(error));
                });
            })
        }
    }
}
