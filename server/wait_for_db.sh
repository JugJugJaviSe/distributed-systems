#!/bin/sh
# Wait for MySQL to be ready
set -e

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u "root" -p"1234" -e "select 1"; do
  echo "Waiting for MySQL at $host..."
  sleep 2
done

exec $cmd
