#!/usr/bin/env bash

openssl genrsa -des3 -out root_ca.key 2048
openssl req -x509 -new -nodes -key root_ca.key -sha256 -days 1024 -out root_ca.pem
