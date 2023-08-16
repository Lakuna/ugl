import Color from "#Color";
import { describe, it } from "mocha";
import { expect } from "chai";

const epsilon = 0.000001;

describe("Color", () => {
	describe("#r", () => {
		const hex = 0x80ffff;
		const expected = 0x80 / 0xff;

		it("should have the correct value", () => {
			expect(new Color(hex).r - expected).to.be.within(-epsilon, epsilon);
		});
	});

	describe("#g", () => {
		const hex = 0xff80ff;
		const expected = 0x80 / 0xff;

		it("should have the correct value", () => {
			expect(new Color(hex).g - expected).to.be.within(-epsilon, epsilon);
		});
	});

	describe("#b", () => {
		const hex = 0xffff80;
		const expected = 0x80 / 0xff;

		it("should have the correct value", () => {
			expect(new Color(hex).b - expected).to.be.within(-epsilon, epsilon);
		});
	});

	describe("#a", () => {
		const rgba = [0xff / 0xff, 0xff / 0xff, 0xff / 0xff, 0x80 / 0xff];
		const expected = 0x80 / 0xff;

		it("should have the correct value", () => {
			expect(new Color(...rgba).a - expected).to.be.within(-epsilon, epsilon);
		});
	});

	describe("#luminance", () => {
		const hex = 0xffffff;
		const expected = 0xff / 0xff;

		it("should return the correct value", () => {
			expect(new Color(hex).luminance - expected).to.be.within(
				-epsilon,
				epsilon
			);
		});
	});

	describe("#contrast()", () => {
		const hexOne = 0x000000;
		const hexTwo = 0xffffff;
		const expected = 21;

		it("should return the correct value", () => {
			expect(
				new Color(hexOne).contrast(new Color(hexTwo)) - expected
			).to.be.within(-epsilon, epsilon);
		});
	});
});
