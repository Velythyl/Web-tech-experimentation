#!/bin/bash

echo "You provided argument $1"

mysql -u gautchar -p -h mysql <DDL.sql
mysql -u gautchar -p -h mysql <Populate.sql