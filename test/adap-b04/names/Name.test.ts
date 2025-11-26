import { describe, it, expect } from "vitest";

// Common exceptions used in tests
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { ESCAPE_CHARACTER } from "../../../src/adap-b04/common/Printable";

// Name classes to be tested
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

describe("B04 Contract Tests for Name Classes", () => {

    describe("StringName Preconditions", () => {
        it("constructor throws for null source string", () => {
            const badCall = () => new StringName(null as any, '/');
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("constructor throws for multi-character delimiter", () => {
            const badCall = () => new StringName("a/b", "//");
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("constructor throws when delimiter is the escape character", () => {
            const badCall = () => new StringName("a/b", ESCAPE_CHARACTER);
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("setComponent throws for an invalid component", () => {
            const name = new StringName("a/b", "/");
            const badCall = () => name.setComponent(0, "x/y");
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("insert throws for an out-of-bounds index", () => {
            const name = new StringName("a/b", "/");
            const badCall = () => name.insert(3, "c");
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("append throws for an invalid component containing the delimiter", () => {
            const name = new StringName("a", ".");
            const badCall = () => name.append("b.c");
            expect(badCall).toThrow(IllegalArgumentException);
        });
    });

    describe("StringArrayName Preconditions", () => {
        it("constructor throws for null source array", () => {
            const badCall = () => new StringArrayName(null as any, '.');
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("constructor throws for an array containing invalid components", () => {
            const badCall = () => new StringArrayName(["a", "b.c", "d"], '.');
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("append throws for an invalid component", () => {
            const name = new StringArrayName(["a", "b"], ".");
            const badCall = () => name.append("c.d");
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("remove throws for a negative index", () => {
            const name = new StringArrayName(["a", "b"], ".");
            const badCall = () => name.remove(-1);
            expect(badCall).toThrow(IllegalArgumentException);
        });

        it("getComponent throws for an out-of-bounds index", () => {
            const name = new StringArrayName(["a", "b"], ".");
            const badCall = () => name.getComponent(2);
            expect(badCall).toThrow(IllegalArgumentException);
        });
    });
});