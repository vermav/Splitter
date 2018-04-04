import { Component } from '@angular/core';
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  private web3: Web3;

  title = 'app';

ngOnInit()
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
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        console.log(this.web3.eth.accounts);
      }
} 

}
