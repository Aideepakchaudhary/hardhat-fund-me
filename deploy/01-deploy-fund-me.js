// function deplyfunc() {
//     console.log("Hi!");
// }

const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

// module.exports.default = deplyfunc;

// same thing which written down:

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
};

// const fundMe = await deploy("FundMe", {
//     from: deployer,
//     args: [address], // put price feed address
//     log: true,
// });
