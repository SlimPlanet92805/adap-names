import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character.");
        }
        this.delimiter = delimiter;
    }

    abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        const unescapedComponents: string[] = [];
        const numComponents = this.getNoComponents();
        for (let i = 0; i < numComponents; i++) {
            const component = this.getComponent(i);
            let result = '';
            let j = 0;
            while (j < component.length) {
                if (component[j] === ESCAPE_CHARACTER && j + 1 < component.length) {
                    result += component[j + 1];
                    j += 2;
                } else {
                    result += component[j];
                    j++;
                }
            }
            unescapedComponents.push(result);
        }
        return unescapedComponents.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        const numComponents = this.getNoComponents();
        for (let i = 0; i < numComponents; i++) {
            components.push(this.getComponent(i));
        }
        return components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        this.assertIsNotNullOrUndefined(other);
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        this.assertIsNotNullOrUndefined(other);
        const otherNoComponents = other.getNoComponents();
        for (let i = 0; i < otherNoComponents; i++) {
            const component = other.getComponent(i);
            this.append(component);
        }
    }

    protected assertIsNotNullOrUndefined(other: Object): void {
        if ((other == null) || (other == undefined)) {
            throw new RangeError("Value is null or undefined");
        }
    }

    protected assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error(`Invalid index`);
        }
    }

}