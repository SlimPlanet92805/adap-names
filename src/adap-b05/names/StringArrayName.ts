import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(this.isNotNullOrUndefined(source));
        for (const component of source) {
            IllegalArgumentException.assert(this.isValidComponent(component));
        }
        this.components = [...source];
        MethodFailedException.assert(this.components.length === source.length);
        this.checkInvariant();
    }

    public clone(): Name {
        const cloned = new StringArrayName(this.components, this.delimiter);
        return cloned;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldNoComponents = this.getNoComponents();
        this.components[i] = c;

        MethodFailedException.assert(this.getComponent(i) === c);
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents);
        this.checkInvariant();
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidInsertIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldNoComponents = this.getNoComponents();
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error(`Invalid insert index`);
        }
        this.components.splice(i, 0, c);

        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1);
        MethodFailedException.assert(this.getComponent(i) === c);
        this.checkInvariant();
    }

    public append(c: string) {
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldNoComponents = this.getNoComponents();
        this.components.push(c);
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1);
        MethodFailedException.assert(this.getComponent(oldNoComponents) === c);
        this.checkInvariant();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const oldNoComponents = this.getNoComponents();
        this.components.splice(i, 1);
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents - 1);
        this.checkInvariant();
    }
}