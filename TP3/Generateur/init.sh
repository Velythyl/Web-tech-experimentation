#!/bin/bash

echo "You provided argument $1"

mysql -p -h mysql $1 <DDL.sql
mysql -p -h mysql $1 <Populate.sql
mysql -p -h mysql $1 <DML.sql
