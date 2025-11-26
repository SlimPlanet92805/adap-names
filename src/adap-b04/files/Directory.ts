import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        IllegalArgumentException.assert(this.isNotNullOrUndefined(cn));
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(this.isNotNullOrUndefined(cn));
        IllegalArgumentException.assert(cn !== this);
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(this.isNotNullOrUndefined(cn));
        IllegalArgumentException.assert(this.hasChildNode(cn));
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}