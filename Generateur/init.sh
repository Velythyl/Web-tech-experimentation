#!/bin/bash

echo "You provided argument $1"

mysql -u gautchar -p -h mysql -e <DDL.sql
mysql -u gautchar -p -h mysql -e <Populate.sql
mysql -u gautchar -p -h mysql -e <DML.sql
