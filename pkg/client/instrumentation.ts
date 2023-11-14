import s from "./inject";

declare global {
  var FOO: string;
}

export async function register() {
  console.time("on cold start");
  
  const _s = JSON.parse(s);
  console.log(_s.FOO);

  global.FOO = _s.FOO;

  // add guard
  Object.defineProperty(global, "FOO", {
    writable: false
  })

  console.timeEnd("on cold start");
}
