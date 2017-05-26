export function createDelay(timeout: number) {
    return function delay() {
        return new Promise(function executor(resolve, reject) {
            setTimeout(resolve, timeout);
        });
    }
}
