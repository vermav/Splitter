import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import * as contract from 'truffle-contract';
import * as Web3 from 'web3'

@Injectable()
export class Web3Service {

    public web3: Web3;
    public data: any

    constructor(private httpClient: HttpClient){}

    initialise()
    {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof this.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            console.log('No web3? You should consider trying MetaMask!');

            // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
            Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            console.log(this.web3.eth.accounts);
        }
    }

    async getArtifacts()
    {
        await this.httpClient.get('./assets/Splitter.json').subscribe(res =>{
                this.data =res
            }) 
    }

    public async artifactsToContract(artifacts) {
        console.log(artifacts)

        if (!this.web3) {
          console.log('Not web3')  
          const delay = new Promise(resolve => setTimeout(resolve, 100));
          await delay;
          return await this.artifactsToContract(artifacts);
        }

        console.log('web3')
        console.log(this.web3.currentProvider)
        const contractAbstraction = await contract(artifacts);
        contractAbstraction.setProvider(this.web3.currentProvider);
        return contractAbstraction;
      }

}