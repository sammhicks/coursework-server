
export function createDelay(delay: number) {
    return function delay() {
        return new Promise(function executor(resolve, reject) {
            setTimeout(resolve, delay);
        });
    }
}
