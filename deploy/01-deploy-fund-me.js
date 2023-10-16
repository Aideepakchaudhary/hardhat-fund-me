// function deplyfunc() {
//     console.log("Hi!");
// }

const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../Utils/verify");

// module.exports.default = deplyfunc;

// same thing which written down:

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        // if we want to deploy on local host.
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmation: network.config.blockConfirmation || 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETH) {
        await verify(fundMe.address, args);
    }

    log("-------------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
