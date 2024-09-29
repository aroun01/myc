#!/bin/bash

# cd /bnbtestru/root/airbnb_fullpack/
# chmod +x shDeleteNodeModules.sh

# ./shDeleteNodeModules.sh

start_time=$(date +%s)

echo "Start Delete Node Modules..."

# Удаляем папки node_modules 
rm -rf admin/client/node_modules
rm -rf user/client/node_modules
rm -rf admin/api/node_modules

end_time=$(date +%s)
elapsed_time=$((end_time - start_time))

echo "Execution time: $elapsed_time seconds"
