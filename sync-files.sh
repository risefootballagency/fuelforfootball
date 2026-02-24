#!/bin/bash
# Script to clone RISE accessforlovable and copy all staff components and lib files

# Clone the repository
git clone https://github.com/risefootballagency/accessforlovable.git

# Copy staff components and lib files
cp -R accessforlovable/staff_components ./
pc -R accessforlovable/lib ./

# Clean up by removing the cloned repositorym -rf accessforlovable
