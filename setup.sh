# Step 1: Create project directory
mkdir myxn-proxy
cd myxn-proxy

# Step 2: Initialize and install
npm init -y
npm install express @titaniumnetwork-dev/ultraviolet cors dotenv

# Step 3: Create folders
mkdir public
mkdir public/uv
mkdir public/assets

# Step 4: Add ALL files (copy-paste from the delivery above)
# - server.js (in root)
# - public/index.html
# - public/styles.css
# - public/app.js
# - public/sw.js
# - public/proxy.html
# - .env (in root)

# Step 5: Copy Ultraviolet
cp -r node_modules/@titaniumnetwork-dev/ultraviolet/dist/* public/uv/

# Step 6: Start
npm start
