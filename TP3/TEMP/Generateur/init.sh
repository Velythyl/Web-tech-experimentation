#!/bin/bash

echo "You provided argument $1"

psql -h postgres $1 <DDL.sql
psql -h postgres $1 <Populate.sql
psql -h postgres $1 <DML.sql
