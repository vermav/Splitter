import { Component } from '@angular/core';
import { Web3Service } from './web3.service'
//import * as products from "./Splitter.json";
//import metacoin_artifacts from '../../../../build/contracts/Splitter.json';
//import { metacoin_artifacts1 } from './Splitter.json';
// import * as contract from 'truffle-contract';
// import * as Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private web3Service: Web3Service) { }

  Splitter: any
  //private web3: Web3;

  title = 'app';

  ngOnInit() {

    this.web3Service.initialise()
   //this.web3Service.getArtifacts()

    this.loadSplitterContract()
    // const delay = new Promise(resolve => setTimeout(resolve, 100));
    // await delay;
    // console.log('Splitter contract')
    // console.log(this.Splitter)

    // this.web3Service.artifactsToContract(this.web3Service.data)
    // .then((SplitterAbstraction) => {
    //   this.Splitter = SplitterAbstraction;
    // });

  }

  async loadSplitterContract() {
    await this.web3Service.getArtifacts()
    
    if (typeof this.web3Service.data === 'undefined') {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
    }
    
    console.log('Splitter contract')
    console.log(this.web3Service.data)

    await this.web3Service.artifactsToContract(this.web3Service.data)
    .then((SplitterAbstraction) => {
      this.Splitter = SplitterAbstraction;
    })

    console.log("Printting Instance ")
    console.log(this.Splitter)

    const splitterInstance = this.Splitter.deployed();

    
    console.log(splitterInstance)

  }

}

