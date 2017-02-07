import * as escapeHtml from "escape-html";
import { Renderable } from "./renderable";

export class String extends Renderable {
    constructor(private value: string) {
        super();
    }

    Render(): string {
        return escapeHtml(this.value);
    }
}