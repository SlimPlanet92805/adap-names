import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    protected override checkInvariant(): void {
        super.checkInvariant();
        InvalidStateException.assert(this.noComponents === this.getComponents().length);
    }

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(this.isNotNullOrUndefined(source));

        this.name = source;
        if (source.length === 0) {
            this.noComponents = 1;
            return;
        }
        this.noComponents = this.getComponents().length;

        MethodFailedException.assert(this.name === source);
        this.checkInvariant();
    }

    public clone(): Name {
        const cloned = new StringName(this.name, this.delimiter);
        return cloned;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const components = this.getComponents();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldNoComponents = this.getNoComponents();
        const components = this.getComponents();
        components[i] = c;
        this.setBackingString(components);

        MethodFailedException.assert(this.getNoComponents() === oldNoComponents);
        MethodFailedException.assert(this.getComponent(i) === c);
        this.checkInvariant();
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidInsertIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldNoComponents = this.getNoComponents();
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.setBackingString(components);
        this.noComponents++;

        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1);
        MethodFailedException.assert(this.getComponent(i) === c);
        this.checkInvariant();
    }

    public append(c: string) {
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldNoComponents = this.getNoComponents();
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;

        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1);
        MethodFailedException.assert(this.getComponent(oldNoComponents) === c);
        this.checkInvariant();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const oldNoComponents = this.getNoComponents();
        const components = this.getComponents();
        components.splice(i, 1);
        this.setBackingString(components);
        this.noComponents--;

        MethodFailedException.assert(this.getNoComponents() === oldNoComponents - 1);
        this.checkInvariant();
    }

    private setBackingString(components: string[]): void {
        this.name = components.join(this.delimiter);
    }

    protected getComponents(): string[] {
        if (this.noComponents === 0) {
            return [];
        }

        if (this.name.length === 0) {
            return [""];
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