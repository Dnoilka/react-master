#!/bin/sh

# Запускаем nginx в фоновом режиме
nginx &

# Запускаем Node.js сервер
node server.js