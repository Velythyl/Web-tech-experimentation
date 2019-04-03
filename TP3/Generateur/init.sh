#!/bin/bash

echo "You provided argument $1"

mysql -p -h mysql -u gautchar <DDL.sql
mysql -p -h mysql -u gautchar <Populate.sql
mysql -p -h mysql -u gautchar <DML.sql
