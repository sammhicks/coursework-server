import { Readable } from "stream";

export class BufferReader extends Readable {
    constructor(data: Buffer) {
        let remainingData = data;

        super({
            read: function read(size: number) {
                while (true) {
                    if (remainingData.length == 0) {
                        this.push(null);
                        break;
                    }
                    else {
                        let payload = remainingData.slice(0, size);
                        remainingData = remainingData.slice(size);

                        if (!(<Readable>this).push(payload)) {
                            break;
                        }
                    }
                }
            }
        })
    }
}
