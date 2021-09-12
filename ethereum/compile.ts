const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Campaign.sol'
];

//if it doesn't exist, create it
fs.ensureDirSync(buildPath);

// loop over output and write each contract to different file in build directory
if (output.errors) {
  output.errors.forEach((err) => {
    console.log(err.formattedMessage);
  });
} else {
  for (let contract in output) {
    fs.outputJsonSync(
      path.resolve(buildPath, `${contract.replace(':', '')}.json`),
      output[contract]
    );
  }
}
