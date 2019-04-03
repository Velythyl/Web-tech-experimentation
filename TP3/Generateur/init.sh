#!/bin/bash

echo "You provided argument $1"

mysql -p -h mysql <DDL.sql
mysql -p -h mysql <Populate.sql
mysql -p -h mysql <DML.sql
