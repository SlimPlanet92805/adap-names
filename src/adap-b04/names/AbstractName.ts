import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected checkInvariant(): void {
        InvalidStateException.assert(this.isValidDelimiter(this.delimiter), "Object's internal delimiter is invalid.");

        InvalidStateException.assert(this.getNoComponents() >= 0, "Number of components cannot be negative.");
    }

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));
        this.delimiter = delimiter;

        const newDelimiter = this.getDelimiterCharacter();
        MethodFailedException.assert(this.isValidDelimiter(newDelimiter));
    }

    abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));
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
        IllegalArgumentException.assert(this.isNotNullOrUndefined(other));
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
        IllegalArgumentException.assert(this.isNotNullOrUndefined(other));
        const oldNoComponents = this.getNoComponents();
        const otherNoComponents = other.getNoComponents();
        for (let i = 0; i < otherNoComponents; i++) {
            const component = other.getComponent(i);
            this.append(component);
        }
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + otherNoComponents);
        this.checkInvariant();
    }

    protected isValidDelimiter(delimiter: string): boolean {
        if (delimiter === undefined || delimiter === null) {
            return false;
        }
        if (delimiter === ESCAPE_CHARACTER) {
            return false;
        }
        if (delimiter.length !== 1) {
            return false;
        }
        return true;
    }

    protected isNotNullOrUndefined(other: Object): boolean {
        if ((other == null) || (other == undefined)) {
            return false;
        }
        return true;
    }

    protected isValidIndex(i: number): boolean {
        if (i < 0 || i >= this.getNoComponents()) {
            return false;
        }
        return true;
    }

    protected isValidInsertIndex(i: number): boolean {
        return i >= 0 && i <= this.getNoComponents();
    }

    protected isValidComponent(c: string): boolean {
        if (!this.isNotNullOrUndefined(c)) return false;

        let index = c.indexOf(this.delimiter);
        while (index !== -1) {
            if (index != 0 || c[index - 1] !== ESCAPE_CHARACTER) {
                return false;
            }
            index = c.indexOf(this.delimiter, index + 1);
        }
        return true;
    }

}