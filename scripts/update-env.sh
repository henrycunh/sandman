#!/usr/bin/env sh
CONFIG_FILE=$1

[ -z $CONFIG_FILE ] && echo "Provide a google credentials file" && exit 1

ENCODED=$(cat $CONFIG_FILE | base64 -w 0)
ENCODED_ESCAPED=$(echo $ENCODED | sed 's/\//\\\//g')

sed -i -E "/GOOGLE_CREDENTIALS_CONTENT/s/GOOGLE_CREDENTIALS_CONTENT=(..*)/GOOGLE_CREDENTIALS_CONTENT=$ENCODED_ESCAPED/g" .env