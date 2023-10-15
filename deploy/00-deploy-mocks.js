const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        log("local network detected! Deploying mocks..");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true, // show full info in console log.
            args: [DECIMALS, INITIAL_ANSWER],
        });

        log("Mocks deployed!");
        log(
            "-----------------------------------------------------------------------"
        );
    }
};

module.exports.tags = ["all", "mocks"]; // if we want to run only mock then we can pass ```--tags mocks``` to deply this.
