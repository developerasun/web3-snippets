// ESM
import { consola, createConsola } from "consola";

export async function logConfirm(message: string) {
  const consola = createConsola({
    reporters: [
      {
        log: (logObj) => {
          console.log(JSON.stringify(logObj));
        },
      },
    ],
  });

  await consola.prompt(message, {
    type: "confirm",
  });
}

export function logLink(txHash: `0x${string}`) {
  consola.success("transaction done: ", `https://mumbai.polygonscan.com/tx/${txHash}`);
}
