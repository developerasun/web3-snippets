import { DUMMY_VALUES } from "@/server/lib/constants";

const newDummies: typeof DUMMY_VALUES = Object.create(DUMMY_VALUES);

export async function register() {
  try {
    console.time("on cold start");
    console.log(DUMMY_VALUES);
    console.timeEnd("on cold start");
  } catch (error) {
    console.error(error);
  }
}
