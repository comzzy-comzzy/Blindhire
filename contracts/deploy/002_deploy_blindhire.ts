import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const blindHire = await deploy("BlindHire", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`BlindHire deployed to: ${blindHire.address}`);
};

export default func;
func.id = "deploy_blind_hire";
func.tags = ["BlindHire"];
