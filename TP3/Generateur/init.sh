#!/bin/bash

echo "You provided argument $1"

mysql -u gautchar -p -h mysql -e <DDL.sql
mysql -u gautchar -p -h mysql gautchar_IFT3225TP3 <Populate.sql
mysql -u gautchar -p -h mysql -e <DML.sql
