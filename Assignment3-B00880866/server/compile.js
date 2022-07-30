const path = require("path");
const fs = require("fs");
const solc = require("solc");

const AgreementPath = path.resolve(__dirname, "contracts", "Agreement.sol");
const source = fs.readFileSync(AgreementPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    Agreement: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(
  JSON.stringify(output.contracts["Agreement"].AgreementContract.abi)
);

module.exports = output.contracts["Agreement"].AgreementContract;
