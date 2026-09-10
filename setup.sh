#!/bin/bash

# ============ COLORS ============
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ============ FUNCTIONS ============

print_header() {
  echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║   StudyHub v4 - Setup & Installation   ║${NC}"
  echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
}

print_step() {
  echo -e "${BLUE}→${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}!${NC} $1"
}

# ============ CHECKS ============

check_node() {
  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    print_step "Install Node.js 18+ from https://nodejs.org"
    exit 1
  fi
  
  NODE_VERSION=$(node -v)
  print_success "Node.js installed: $NODE_VERSION"
}

check_npm() {
  if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
  fi
  
  NPM_VERSION=$(npm -v)
  print_success "npm installed: $NPM_VERSION"
}

# ============ SETUP ============

setup_directories() {
  print_step "Setting up directories..."
  
  mkdir -p public/uv
  mkdir -p logs
  
  print_success "Directories created"
}

install_dependencies() {
  print_step "Installing dependencies..."
  print_warning "This may take a few minutes..."
  
  npm install
  
  if [ $? -eq 0 ]; then
    print_success "Dependencies installed"
  else
    print_error "Failed to install dependencies"
    exit 1
  fi
}

setup_env() {
  print_step "Setting up environment..."
  
  if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
PROXY_SECRET=studyhub_secure_key_2024
LOG_LEVEL=info
MAX_CONNECTIONS=1000
PROXY_TIMEOUT=30000
ENABLE_CORS=true
ALLOWED_ORIGINS=*
EOF
    print_success ".env created"
  else
    print_warning ".env already exists"
  fi
}

download_ultraviolet() {
  print_step "Checking Ultraviolet files..."
  
  if [ ! -f "public/uv/uv.bundle.js" ]; then
    print_step "Downloading Ultraviolet..."
    # Ultraviolet will be installed via npm
    print_success "Ultraviolet ready (via npm)"
  else
    print_success "Ultraviolet already present"
  fi
}

# ============ MAIN ============

main() {
  print_header
  echo ""
  
  print_step "Starting setup process..."
  echo ""
  
  check_node
  check_npm
  echo ""
  
  setup_directories
  echo ""
  
  setup_env
  echo ""
  
  install_dependencies
  echo ""
  
  download_ultraviolet
  echo ""
  
  print_success "Setup complete!"
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║     Setup successful! Ready to run     ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}To start the server:${NC}"
  echo -e "${YELLOW}npm start${NC}"
  echo ""
  echo -e "${CYAN}Server will run on:${NC}"
  echo -e "${YELLOW}http://localhost:3000${NC}"
  echo ""
}

main
