const { deployments, ethers, getNamedAccounts } = require("hardhat"); // runtime environment..
const { assert } = require("chai");

describe("FundMe", async function () {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    beforeEach(async function () {
        deployer = await ethers.provider.getSigner();
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContractAt(
            "FundMe",
            (
                await deployments.get("FundMe")
            ).address,
            deployer
        );
        mockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            (
                await deployments.get("MockV3Aggregator")
            ).address,
            deployer
        );
    });

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, await mockV3Aggregator.getAddress());
        });
    });
});
