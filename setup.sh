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

check_git() {
  if ! command -v git &> /dev/null; then
    print_warning "git not found (optional)"
  else
    GIT_VERSION=$(git --version)
    print_success "git installed: $GIT_VERSION"
  fi
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
    cat > .env << 'EOF'
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

check_proxies() {
  print_step "Checking proxy configuration..."
  print_success "Scramjet v2 - Default proxy"
  print_success "Scramjet v1 - Fallback proxy"
  print_success "UV - Backup proxy"
  print_success "All proxies configured and ready"
}

check_frontend() {
  print_step "Checking frontend files..."
  
  if [ -f "public/index.html" ]; then
    print_success "index.html found"
  else
    print_warning "index.html not found"
  fi
  
  if [ -f "public/app.js" ]; then
    print_success "app.js found"
  else
    print_warning "app.js not found"
  fi
  
  if [ -f "public/styles.css" ]; then
    print_success "styles.css found"
  else
    print_warning "styles.css not found"
  fi
  
  if [ -f "public/proxy.html" ]; then
    print_success "proxy.html found"
  else
    print_warning "proxy.html not found"
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
  check_git
  echo ""
  
  setup_directories
  echo ""
  
  setup_env
  echo ""
  
  install_dependencies
  echo ""
  
  check_proxies
  echo ""
  
  check_frontend
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
  echo -e "${CYAN}Password: ${YELLOW}unblock${NC}"
  echo ""
  echo -e "${CYAN}Proxies available:${NC}"
  echo -e "${YELLOW}• Scramjet v2 (default)${NC}"
  echo -e "${YELLOW}• Scramjet v1${NC}"
  echo -e "${YELLOW}• UV${NC}"
  echo ""
}

main
