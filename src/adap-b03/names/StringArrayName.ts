import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.initialize(source);
    }

    public initialize(source: string[]) {
        if (source === undefined || source === null) {
            this.components = [];
            return;
        }
        this.components = [...source];
    }

    public clone(): Name {
        const cloned = new StringArrayName(this.components, this.delimiter);
        return cloned;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error(`Invalid insert index`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }
}