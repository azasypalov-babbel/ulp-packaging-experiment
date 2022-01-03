#!/usr/bin/env bash

docker run --rm \
  -v ${PWD}/doc/diagrams:/work \
  miy4/plantuml -tsvg -o /work/out /work/src