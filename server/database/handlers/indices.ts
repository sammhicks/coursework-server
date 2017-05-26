export function parseIndices(input: string) {
    const regExp = /\d*(?:\+\d*)*/;

    if (input.match(regExp)[0] == input) {
        return input.split("+").map(n => parseInt(n, 10));
    } else {
        return null;
    }
}
