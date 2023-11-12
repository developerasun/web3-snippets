#!/bin/bash

arg=$1

echo arg from terminal: $arg

PATCH=patch

if [ $arg = $PATCH ]; then
	# yarn version --$arg
	pnpm version patch

	echo listing up tags
	git tag
else
	echo invalid argument for versioning
	exit 1
fi
