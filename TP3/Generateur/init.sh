#!/bin/bash

echo "You provided argument $1"

mysql -u gautchar <DDL.sql
mysql -u gautchar gautchar_IFT3225TP3 <Populate.sql
mysql -u gautchar gautchar_IFT3225TP3 <DML.sql
