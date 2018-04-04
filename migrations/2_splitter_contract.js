var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Splitter, "Alice" , "Bob", 0xf17f52151ebef6c7334fad080c5704d77216b732,"Carol", 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef);
};