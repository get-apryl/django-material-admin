#!/bin/sh

rm -rf *.egg-info
rm dist/*
python -mbuild
