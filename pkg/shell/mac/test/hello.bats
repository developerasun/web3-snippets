#!/usr/bin/env bats

@test "Print hello world" {
  result=$(../hello.sh)
  [ "${result}" == "hello world" ]
}
