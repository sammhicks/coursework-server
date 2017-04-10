import * as os from "os";
import { Element } from "./element";
import { Favicon } from "./favicon";
import { Renderable } from "./renderable";
import { String } from "./string";

export class Document extends Renderable {
    constructor(private language: string, private title: string, private meta: { [name: string]: string }, private favicons: Favicon[], private stylesheets: string[], private scripts: string[], private body: Element) {
        super();
    }

    Render(): string {
        return "<!DOCTYPE html>" + this.GenerateDocument().Render() + os.EOL;
    }

    private GenerateDocument(): Element {
        return new Element("html", {
            "xmlns": "http://www.w3.org/1999/xhtml",
            "lang": this.language,
            "xml:lang": this.language
        }, [
                this.GenerateHead(),
                this.body
            ]);
    }

    private GenerateHead(): Element {
        return new Element(
            "head",
            {},
            [].concat(
                this.GenerateMeta(),
                this.favicons,
                new Element("title", {}, [new String(this.title)]),
                this.GenerateStyleSheets(),
                this.GenerateScripts()
            )
        );
    }

    private GenerateMeta(): Element[] {
        return [].concat(
            new Element("meta", { charset: "UTF-8" }),
            Object.keys(this.meta).map(
                (key) => new Element("meta", { name: key, content: this.meta[key] })
            )
        );
    }

    private GenerateStyleSheets(): Element[] {
        return this.stylesheets.map(
            (stylesheet) => new Element("link", { rel: "stylesheet", type: "text/css", href: stylesheet })
        )
    }

    private GenerateScripts(): Element[] {
        return this.scripts.map(
            (script) => new Element("script", { src: script }, [])
        );
    }
}
