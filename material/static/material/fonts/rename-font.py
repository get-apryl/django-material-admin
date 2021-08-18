#!/usr/bin/env python3

import base64
import hashlib
import os
import sys


def main(*filenames: str):
    for filename in filenames:
        with open(filename, 'rb') as f:
            h = hashlib.sha3_384(f.read())
        new_name = base64.urlsafe_b64encode(h.digest()).decode('utf-8')
        print(f"{filename} -> {new_name}.woff")
        os.rename(filename, f"{new_name}.woff")


if __name__ == '__main__':
    main(*sys.argv[1:])
