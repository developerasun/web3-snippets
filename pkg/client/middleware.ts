import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DUMMY_VALUES } from "./server/lib/constants";

export let globalFoo: null | typeof DUMMY_VALUES = null;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  class MagicValue {
    get() {
      return 3;
    }
  }

  const mv = new MagicValue();
  console.log(mv.get());
  // return NextResponse.rewrite(destination)
  globalFoo = DUMMY_VALUES;

  const _headers = new Headers(request.headers);
  _headers.set("magic-value", mv.get().toString());
  _headers.set("global-foo", JSON.stringify(globalFoo));

  return NextResponse.next({
    request: {
      headers: _headers,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/test",
};
