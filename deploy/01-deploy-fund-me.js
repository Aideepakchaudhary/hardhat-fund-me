// function deplyfunc() {
//     console.log("Hi!");
// }

// module.exports.default = deplyfunc;

// same thing which written down:

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
};
