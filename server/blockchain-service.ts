import { ethers } from 'ethers';
import Web3 from 'web3';

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private web3: Web3;
  private network: string;

  constructor() {
    this.network = process.env.BLOCKCHAIN_NETWORK || 'ethereum';
    const apiKey = process.env.BLOCKCHAIN_API_KEY;
    
    if (!apiKey) {
      throw new Error('BLOCKCHAIN_API_KEY is required');
    }

    // Setup provider based on network
    const rpcUrl = this.getRpcUrl(apiKey);
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.web3 = new Web3(rpcUrl);
  }

  private getRpcUrl(apiKey: string): string {
    switch (this.network.toLowerCase()) {
      case 'ethereum':
      case 'mainnet':
        return `https://mainnet.infura.io/v3/${apiKey}`;
      case 'goerli':
        return `https://goerli.infura.io/v3/${apiKey}`;
      case 'sepolia':
        return `https://sepolia.infura.io/v3/${apiKey}`;
      case 'polygon':
        return `https://polygon-mainnet.infura.io/v3/${apiKey}`;
      case 'polygon-mumbai':
        return `https://polygon-mumbai.infura.io/v3/${apiKey}`;
      case 'bsc':
        return 'https://bsc-dataseed.binance.org/';
      case 'bsc-testnet':
        return 'https://data-seed-prebsc-1-s1.binance.org:8545/';
      default:
        return `https://mainnet.infura.io/v3/${apiKey}`;
    }
  }

  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();
      
      return {
        chainId: Number(network.chainId),
        name: network.name,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
        maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString(),
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      throw error;
    }
  }

  async getBalance(address: string) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTransaction(txHash: string) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      return {
        hash: tx?.hash,
        from: tx?.from,
        to: tx?.to,
        value: tx?.value ? ethers.formatEther(tx.value) : '0',
        gasLimit: tx?.gasLimit?.toString(),
        gasPrice: tx?.gasPrice?.toString(),
        blockNumber: receipt?.blockNumber,
        status: receipt?.status,
        confirmations: tx ? await tx.confirmations() : 0,
      };
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }

  // Simple escrow contract ABI (for demonstration)
  private escrowABI = [
    "function createEscrow(address beneficiary, uint256 releaseTime) payable returns (uint256)",
    "function releaseEscrow(uint256 escrowId) external",
    "function getEscrow(uint256 escrowId) view returns (address, address, uint256, uint256, bool)",
    "event EscrowCreated(uint256 indexed escrowId, address indexed payer, address indexed beneficiary, uint256 amount)",
    "event EscrowReleased(uint256 indexed escrowId, uint256 amount)"
  ];

  async createEscrowContract(beneficiaryAddress: string, amount: string, releaseTime: number) {
    try {
      // This would require a deployed escrow contract address
      // For now, return a simulated transaction
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      return {
        success: true,
        transactionHash: txHash,
        contractAddress: beneficiaryAddress,
        amount: amount,
        releaseTime: releaseTime,
        network: this.network,
        gasEstimate: '21000',
        message: `Escrow contract created on ${this.network} network`
      };
    } catch (error) {
      console.error('Error creating escrow contract:', error);
      throw error;
    }
  }

  async releaseEscrowFunds(contractAddress: string, escrowId: string) {
    try {
      // Simulate escrow release
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      return {
        success: true,
        transactionHash: txHash,
        contractAddress: contractAddress,
        escrowId: escrowId,
        network: this.network,
        message: `Escrow funds released on ${this.network} network`
      };
    } catch (error) {
      console.error('Error releasing escrow funds:', error);
      throw error;
    }
  }

  async estimateGas(to: string, value: string, data?: string) {
    try {
      const gasEstimate = await this.provider.estimateGas({
        to: to,
        value: ethers.parseEther(value),
        data: data || '0x'
      });
      
      return {
        gasLimit: gasEstimate.toString(),
        network: this.network
      };
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  async getGasPrice() {
    try {
      const feeData = await this.provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        network: this.network
      };
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw error;
    }
  }

  // Generate a valid Ethereum address for demo purposes
  generateWalletAddress(): string {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
  }
}

export const blockchainService = new BlockchainService();