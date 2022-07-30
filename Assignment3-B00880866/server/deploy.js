const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider(
  "blood lemon large utility rhythm market open rule divorce swallow soup priority",
  "https://rinkeby.infura.io/v3/68c73c2013f74c9c9cbf051f787b381d"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  try {
    const result = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({ gas: "1000258612000000000", from: accounts[0] });
    console.log("Contract deployed to", result.options.address);
  } catch (error) {
    console.log(error.message);
  }

  provider.engine.stop();
};
deploy();
