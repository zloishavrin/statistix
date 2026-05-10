#!/bin/sh

set -e

envsubst '${GATEWAY_ALLOW_ORIGINS}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'