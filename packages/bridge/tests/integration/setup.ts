import { spawn } from 'child_process';
import * as hre from 'hardhat';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { BigNumber, ethers, Signer } from 'ethers';
import { Config } from '../../src/app/ports/IConfigPort';
import { getTestAccounts } from '../_utils/accounts';

const artifactsBasePath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'artifacts',
  'contracts',
);

async function startChainA() {
  const hardhatNode = spawn('npx', ['hardhat', 'node'], {
    detached: true,
    stdio: 'ignore',
  });

  // Wait for Hardhat node to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return hardhatNode;
}

async function startChainB() {
  return await startHardhatNode(8546);
}

async function startHardhatNode(port: number) {
  const hardhatNode = spawn('npx', ['hardhat', 'node', '--port', `${port}`], {
    detached: true,
    stdio: 'ignore',
  });

  // Wait for Hardhat node to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return hardhatNode;
}

async function deployContract(
  contractName: string, // Name of the contract (e.g., "MyContract")
  signer: Signer, // ethers.js signer (e.g., from a wallet or provider)
  constructorArgs: unknown[] = [], // Constructor arguments for the contract (if any)
) {
  // Path to the compiled contract artifacts
  const artifactsPath = path.join(
    artifactsBasePath,
    `${contractName}.sol`,
    `${contractName}.json`,
  );

  // Read the contract artifact
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));

  // Get the ABI and bytecode from the artifact
  const abi = contractArtifact.abi;
  const bytecode = contractArtifact.bytecode;

  // Create a contract factory
  const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

  // Deploy the contract
  const contract = await contractFactory.deploy(...constructorArgs);

  // Wait for the contract to be deployed
  return await contract.deployed();
}

export async function setupSystem(
  initialErc20Supply: BigNumber,
  usersErc20Supply: BigNumber,
) {
  // start local nodes
  const chainAPort = 8545;
  const chainBPort = 8545;

  const chainAProcess = await startChainA();
  const chainBProcess = await startChainB();

  // get deployers
  const chainAUrl = 'http://127.0.0.1:8545/';

  const chainAProvider = new ethers.providers.JsonRpcProvider(chainAUrl);
  const solverAccountChainASinger = new ethers.Wallet(
    getTestAccounts().chainA.solver.privateKey,
    chainAProvider,
  );

  const chainBUrl = 'http://127.0.0.1:8545/';

  const chainBProvider = new ethers.providers.JsonRpcProvider(chainBUrl);
  const solverAccountChainBSinger = new ethers.Wallet(
    getTestAccounts().chainB.solver.privateKey,
    chainBProvider,
  );

  // compile erc20 contracts
  await hre.run('compile');

  // deploy erc20 contracts
  const chainATokenASolverAccountContract = await deployContract(
    'TokenA',
    solverAccountChainASinger,
    [initialErc20Supply],
  );
  const chainATokenBSolverAccountContract = await deployContract(
    'TokenB',
    solverAccountChainASinger,
    [initialErc20Supply],
  );

  const chainBTokenASolverAccountContract = await deployContract(
    'TokenA',
    solverAccountChainBSinger,
    [initialErc20Supply],
  );
  const chainBTokenBSolverAccountContract = await deployContract(
    'TokenB',
    solverAccountChainBSinger,
    [initialErc20Supply],
  );

  // fund users with tokens
  const tx = await chainATokenASolverAccountContract.transfer(
    getTestAccounts().chainA.userA.address,
    usersErc20Supply,
  );
  await tx.wait();

  const bridgeTestConfig: Config = {
    BRIDGE_ACCOUNT_ADDRESS: getTestAccounts().bridge.address,
    BRIDGE_ACCOUNT_PK: getTestAccounts().bridge.privateKey,

    CHAIN_A_ID: 1337,
    CHAIN_A_URL: chainAUrl,
    CHAIN_A_PORT: chainAPort,
    CHAIN_A_SOLVER_ACCOUNT_ADDRESS: getTestAccounts().chainA.solver.address,
    CHAIN_A_TOKEN_A_ADDRESS: chainATokenASolverAccountContract.address,
    CHAIN_A_TOKEN_B_ADDRESS: chainATokenBSolverAccountContract.address,

    CHAIN_B_ID: 31337,
    CHAIN_B_URL: chainBUrl,
    CHAIN_B_PORT: chainBPort,
    CHAIN_B_SOLVER_ACCOUNT_ADDRESS: getTestAccounts().chainB.solver.address,
    CHAIN_B_TOKEN_A_ADDRESS: chainBTokenASolverAccountContract.address,
    CHAIN_B_TOKEN_B_ADDRESS: chainBTokenBSolverAccountContract.address,
  };

  return {
    chainAProcess,
    chainBProcess,
    chainATokenASolverAccountContract,
    chainATokenBSolverAccountContract,
    chainBTokenASolverAccountContract,
    chainBTokenBSolverAccountContract,
    bridgeTestConfig,
  };
}
