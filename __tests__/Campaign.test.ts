const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { beforeEach, describe, it } = require('mocha');
const compiledFactory = require('../ethereum/build/CompaignFactory.json');
const compiledCampaign = require('../ethereum/build/Compaign.json');
const { AbiItem } = require('web3-utils');

const web3 = new Web3(ganache.provider());
const factoryAbi = compiledFactory.abi;
const campaignAbi = compiledCampaign.abi;
const bytecode = compiledFactory.evm.bytecode.object;

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(factoryAbi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 5000000 });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000',
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    campaignAbi,
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
});
