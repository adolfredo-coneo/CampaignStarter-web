const HDWalletProvider = require('@truffle/hdwallet-provider');
const util = require('util');

const Web3 = require('web3');
const compiledFactory = require('./build/CompaignFactory.json');

const provider = new HDWalletProvider(
  'wing need merry leaf pull vast faith acid three fork pencil ladder',
  'https://rinkeby.infura.io/v3/e9bb66d58efe477391d2f091b46c1602'
);

const web3 = new Web3(provider);
const factoryAbi = compiledFactory.abi;
const bytecode = compiledFactory.evm.bytecode.object;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  try {
    const factory = await new web3.eth.Contract(factoryAbi)
      .deploy({
        data: '0x' + bytecode,
      })
      .send({ from: accounts[0], gas: 4000000 });

    console.log('Contract deployed at', factory.options.address);
  } catch (error) {
    console.log('Error deploying', error);
  }
};

deploy();
