const { run } = require("hardhat");

async function verify(constractAddress, args) {
    console.log("Verifying contract....");

    try {
        await run("verify:verify", {
            address: constractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verfied")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
}

module.exports = { verify };
