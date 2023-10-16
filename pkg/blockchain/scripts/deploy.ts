import { useDeployer } from "./hook";

async function main() {
  await useDeployer("Assembly");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
