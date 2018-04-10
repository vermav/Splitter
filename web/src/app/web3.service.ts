import { Injectable } from '@angular/core'
import * as Web3 from 'web3'
import * as  splitterArtifacts from '../../../build/contracts/Splitter.json'

declare let window: any;

@Injectable()
export class Web3Service {

    public web3: Web3
    public splitterInstance: any
    public accounts: any
    private splitter: any

    constructor() {}

    initialise() {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.web3 = new Web3(this.web3.currentProvider)
        } else {
            console.log('No web3? You should consider trying MetaMask!')
            // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
            Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
            this.artifactsToContract()
        }
    }

    private async artifactsToContract() {
        this.accounts = await this.web3.eth.accounts 

        // ABI description as JSON structure
        const splitterObj = JSON.parse(JSON.stringify(splitterArtifacts))
        const abi =  splitterObj.abi

        // Smart contract EVM bytecode as hex
        const code = splitterObj.bytecode

        // Create Contract proxy class
        this.splitter = this.web3.eth.contract(abi);

        console.log("Deploying the contract");
        this.splitterInstance = await this.splitter.new({ from: this.web3.eth.coinbase, gas: 1000000, data: code })

        // Transaction has entered to geth memory pool
        console.log("Your contract is being deployed in transaction at " + this.splitterInstance.transactionHash);

        this.waitBlock()
    }

    private sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
    We need to wait until any miner has included the transaction in a block 
    to get the address of the contract
    */
    private async waitBlock() {
        while (true) {
            let receipt = await this.web3.eth.getTransactionReceipt(this.splitterInstance.transactionHash);
            if (receipt && receipt.contractAddress) {
                console.log("Your contract has been deployed at  " + receipt.contractAddress);
                this.splitterInstance = this.splitter.at(receipt.contractAddress)
                break
            }
            console.log("Waiting a mined block to include your contract... currently in block " + this.web3.eth.blockNumber)
            await this.sleep(4000)
        }
    }

}