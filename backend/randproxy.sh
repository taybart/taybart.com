#!/bin/zsh

function cleanup {
  rm ./sites/$1
  caddypid=$(ps axf | \grep "[[:space:]][c]addy$" | awk '{print $1}')
  kill -USR1 $caddypid # soft reboot
  echo "cleaned up $1"
}

file=$1.taybart.com

echo "$1.taybart.com {\n proxy / localhost:$2 {\n header_upstream Host {host}\n header_upstream X-Real-IP {remote}\n header_upstream X-Forwarded-For {remote}\n websocket\n }\n}" > ./sites/$file

caddypid=$(ps axf | \grep "[[:space:]][c]addy$" | awk '{print $1}')
kill -USR1 $caddypid # soft reboot

echo "$file now available"
while true
do
  trap 'cleanup $file; exit 0' INT;
  sleep 1
done
