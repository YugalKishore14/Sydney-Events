#!/bin/bash

echo "===== Installing backend deps ====="
cd server
npm install

echo "===== Installing frontend deps ====="
cd ../client
npm install

echo "===== Building frontend ====="
npm run build

echo "===== Copy frontend build to backend ====="
rm -rf ../server/dist
cp -r dist ../server/

echo "===== Starting backend ====="
cd ../server
npm run start
