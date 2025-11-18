import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.initialize(source);
    }

    public initialize(source: string) {
        this.name = source;
        this.noComponents = this.getComponents().length;
    }

    public clone(): Name {
        const cloned = new StringName(this.name, this.delimiter);
        return cloned;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        const components = this.getComponents();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        const components = this.getComponents();
        components[i] = c;
        this.setBackingString(components);
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.getNoComponents()) {
            throw new Error(`Invalid insert index`);
        }
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.setBackingString(components);
        this.noComponents++;
    }

    public append(c: string) {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        const components = this.getComponents();
        components.splice(i, 1);
        this.setBackingString(components);
        this.noComponents--;
    }

    private setBackingString(components: string[]): void {
        this.name = components.join(this.delimiter);
    }

    protected getComponents(): string[] {
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
}