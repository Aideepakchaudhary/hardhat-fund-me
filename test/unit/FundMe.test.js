const { deployments, ethers, getNamedAccounts } = require("hardhat"); // runtime environment..
const { assert, expect } = require("chai");

describe("FundMe", async function () {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.parseEther("1"); // 1 ETH

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

    describe("fund", async function () {
        it("it fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            );
        });
        it("updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.addressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.funders(0);
            assert.equal(funder, deployer.address);
        });
    });

    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from a single founder", async function () {
            // Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.getAddress()
            );
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            );
            // Act

            const transactionResponse = await fundMe.withdraw();

            const transactionReceipt = await transactionResponse.wait(1);
            const { gasUsed, gasPrice } = transactionReceipt;

            const gasCost = gasUsed * gasPrice;

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.getAddress()
            );

            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            );

            // gasCost

            // Assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            );
        });

        it("allows us to withdraw with multiple funders", async function () {
            // Arrange

            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                );
                await fundMeConnectedContract.fund({ value: sendValue });
            }

            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.getAddress()
            );
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            );

            // Act
            const transactionResponse = await fundMe.withdraw();

            const transactionReceipt = await transactionResponse.wait(1);
            const { gasUsed, gasPrice } = transactionReceipt;

            const gasCost = gasUsed * gasPrice;

            // Assert
            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.getAddress()
            );

            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            );

            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingDeployerBalance + startingFundMeBalance,
                endingDeployerBalance + gasCost
            );

            // Make sure that the funders are reset properly
            // await expect(fundMe.funders(0)).to.be.reverted;

            // for (i = 1; i < 6; i++) {
            //     assert.equal(
            //         await fundMe.addressToAmountFunded(accounts[i].address),
            //         0
            //     );
            // }
        });
    });
});
