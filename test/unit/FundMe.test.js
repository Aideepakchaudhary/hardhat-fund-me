const { deployments, ethers, getNamedAccounts } = require("hardhat"); // runtime environment..
const await = require("chai");

describe("FuneMe", async function () {
    let FundMe;
    let deployer;
    let mockV3Aggregator;
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await developmentChains.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
    });

    describe("constructor", async function () {
        const response = await fundMe.priceFeed();
        assert.equal(response, mockV3Aggregator);
    });
});
