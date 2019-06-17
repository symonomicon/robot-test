const assert = require("assert");
const Robot = require("./robot.js");


describe("Inputs", () => {
    describe("Using static values", () => {
        it("Should be equal to test static values: `x: 1, y:1, facing: North`", async () => {
            const optimus = new Robot(1, 1, 0);
            const values = await optimus.init()
            assert.deepEqual(createTestObj(1, 1, 'North'), values);
        })
    })
    describe("Using incorrect static values", () => {
        it("Should be able to set values to max/default", async () => {
            const optimus = new Robot(8, 8, 8);
            const values = await optimus.init()
            assert.deepEqual(createTestObj(4, 4, 'North'), values);
        })
    })
})

describe("Operations", () => {
    const optimus = new Robot(0, 0, 0);
    describe("Report", () => {
        it("Should be able to report current place", () => {
            const values = optimus.report(true);
            if (values)
                assert.ok(values);
            else 
                assert.fail();
        })
    })
    describe("Movement", () => {
        it("Should be able to move northward by a place", () => {
            const values = optimus.move();
            assert.deepEqual(createTestObj(0, 1, 'North'), optimus.report(true))
        })
    })
    describe("Rotate", () => {
        it("Should be able to rotate by left", () => {
            const values = optimus.rotate(1);
            assert.deepEqual(createTestObj(0, 1, 'West'), optimus.report(true))
        })
    })
})

function createTestObj(x, y, facing) {
    return {x, y, facing}
}