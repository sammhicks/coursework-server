import { Renderable } from "./renderable";

export class Literal extends Renderable {
    constructor(private value: string) {
        super();
    }

    Render(): string {
        return this.value;
    }
}
