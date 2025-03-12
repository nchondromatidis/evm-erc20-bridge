import '@nomiclabs/hardhat-ethers';

export default {
  solidity: '0.8.28',
  networks: {
    hardhat: {
      port: 8545,
      chainId: 1337,
    },
  },
};
