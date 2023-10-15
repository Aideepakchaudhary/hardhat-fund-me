// function deplyfunc() {
//     console.log("Hi!");
// }

const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

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

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // put price feed address
        log: true,
    });

    log("-------------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
