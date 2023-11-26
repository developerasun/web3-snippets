# myscript_test.bats

#!/usr/bin/env bats

# bats: Bash Automated Testing System

@test "Test addition" {
  result=$(./myscript.sh 2 3 add)
  [ "$result" -eq 5 ]
}

@test "Test subtraction" {
  result=$(./myscript.sh 5 2 subtract)
  [ "$result" -eq 3 ]
}
