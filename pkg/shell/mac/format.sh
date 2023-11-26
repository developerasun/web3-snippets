#!/bin/bash
# shell formatter: https://github.com/mvdan/sh
# recommend to use this with git hook

TARGET="."

format() {
    echo formatting target shell scripts
    shfmt -l -w "${TARGET}"
}

format
