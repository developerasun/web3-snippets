import { useDeployer } from "./hook";

async function main() {
  // await useDeployer("Assembly");
  await useDeployer("Comparison20");
  // await useDeployer("WithoutTransfer");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
