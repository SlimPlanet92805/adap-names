import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.initialize(source, delimiter);
    }

    public initialize(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.noComponents = this.getComponents().length;
    }

    private getComponents(): string[] {
        if (this.name.length === 0) {
            return [];
        }

        const components: string[] = [];
        let currentComponent = "";
        let i = 0;

        while (i < this.name.length) {
            const char = this.name[i];

            if (char === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) {
                    currentComponent += ESCAPE_CHARACTER;
                    currentComponent += this.name[i + 1];
                    i += 2;
                } else {
                    currentComponent += char;
                    i++;
                }
            } else if (char === this.delimiter) {
                components.push(currentComponent);
                currentComponent = "";
                i++;
            } else {
                currentComponent += char;
                i++;
            }
        }

        components.push(currentComponent);

        return components;
    }

    private setBackingString(components: string[]): void {
        this.name = components.join(this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        const components = this.getComponents();
        const unescapedComponents = components.map(component => {
            let result = '';
            let i = 0;
            while (i < component.length) {
                if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
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
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.name;
        }
        const components = this.getComponents();
        return components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        this.assertIsValidIndex(x);
        const components = this.getComponents();
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        this.assertIsValidIndex(n);
        const components = this.getComponents();
        components[n] = c;
        this.setBackingString(components);
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.getNoComponents()) {
            throw new Error(`Invalid insert index`);
        }
        const components = this.getComponents();
        components.splice(n, 0, c);
        this.setBackingString(components);
        this.noComponents++;
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(n: number): void {
        this.assertIsValidIndex(n);
        const components = this.getComponents();
        components.splice(n, 1);
        this.setBackingString(components);
        this.noComponents--;
    }

    public concat(other: Name): void {
        const num = other.getNoComponents();
        if (num === 0) {
            return;
        }

        const ownComponents = this.getComponents();

        for (let i = 0; i < num; i++) {
            ownComponents.push(other.getComponent(i));
        }

        this.setBackingString(ownComponents);
        this.noComponents = ownComponents.length;
    }

    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new Error(`Invalid index`);
        }
    }

}