import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.initialize(source, delimiter);
    }

    public initialize(source: string[], delimiter?: string) {
        this.components = [...source];
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        const unescapedComponents = this.components.map(component => {
            let result = '';
            let i = 0;
            while (i < component.length) {
                if (component[i] == ESCAPE_CHARACTER && i + 1 < component.length) {
                    result += component[i + 1];
                    i += 2;
                } else {
                    result += component[i];
                    i++;
                }
            }
            return result;
        });
        return unescapedComponents.join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length == 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error(`Invalid insert index`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const num = other.getNoComponents();
        for (let i = 0; i < num; i++) {
            this.append(other.getComponent(i));
        }
    }

    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error(`Invalid index`);
        }
    }

}