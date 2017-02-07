
import * as escapeHtml from "escape-html";
import { Renderable } from "./renderable";

export class Element extends Renderable {
    constructor(private name: string, private attributes: { [attribute: string]: string }, private children?: Renderable[]) {
        super();
    }

    Render(): string {
        return this.RenderHead() + (this.children === undefined) ? this.RenderBody() : "";
    }

    private RenderHead(): string {
        return "<" + name + " " + Element.RenderAttributes(this.attributes) + (this.children === undefined ? "/>" : ">");
    }

    private RenderBody(): string {
        return this.children.map(child => child.Render()).join("") + "</" + name + ">";
    }

    private static RenderAttribute(name: string, value: string): string {
        return '"' + name + '"="' + escapeHtml(value) + '"';
    }

    private static RenderAttributes(attributes: { [name: string]: string }): string {
        return Object.keys(attributes).map(
            (attribute) => Element.RenderAttribute(attribute, attributes[attribute])
        ).join(" ");
    }
}