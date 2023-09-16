import { useDeployer } from "./hook";

async function main() {
  await useDeployer("Box");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
