import { useEventParser } from "./hook";

async function _main() {
  // useEventParser();
}

_main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
