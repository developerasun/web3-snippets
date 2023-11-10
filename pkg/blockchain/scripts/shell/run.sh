#!/bin/bash
# set -x # enable debug mode
set -e # exit immediately when failed

NAME=jake
_NAME=$NAME

echo $_NAME

echo enter your age
read age

echo your age is: $age

_AGR=$1

echo FOO=$_AGR > .env
echo BAR="bar" >> .env

if [ $age -lt 20 ]; then
    echo "you are young"
else
    echo "you are old"
fi

counter=1

while [ $counter -lt 5 ]; 
do
    echo $counter
    ((counter += 1))
done

echo current: $counter

for counter in {5..10}
do
    echo "changed: " $counter
done

cronLogPath = /var/log/syslog

