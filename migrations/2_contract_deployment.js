
const Coin = artifacts.require("StableCoinToken");
const MockOracle = artifacts.require("MockOracle"); 
const ChainlinkOracle = artifacts.require("PriceConsumerV3"); 
const Vault = artifacts.require("Vault"); 

const priceFeedAddresses = {
  kovan: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  polygon: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  mumbai: "0x0715A7794a1dc8e42615AnPs2Cf177Mb8C6976",
  arbitrumOne: "0x639Fe6ab55C921f74db7873539A2C64AEa9d81A1",
  arbitrumGoerli: "0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08",
};

module.exports = async function (deployer, network) {
  await deployer.deploy(Coin, "ARX Stable", "ARX");
  const coin = await Coin.deployed();
  await deployer.deploy(MockOracle);
  const mOracle = await MockOracle.deployed();

  let oracleAddress = priceFeedAddresses[network];

  if (!oracleAddress) {
    console.log(`No oracle address found for network ${network}. Defaulting to Kovan address.`);
    oracleAddress = priceFeedAddresses.kovan; // Default to Kovan
  }

  console.log(`Using oracle address: ${oracleAddress} for network: ${network}`);

  await deployer.deploy(ChainlinkOracle, oracleAddress);
  const oracle = await ChainlinkOracle.deployed();
  await deployer.deploy(Vault, coin.address, oracle.address);
  const vault = await Vault.deployed();

};