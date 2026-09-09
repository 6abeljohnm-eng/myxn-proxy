{ pkgs }: {
  deps = [
    pkgs.nodejs_18
    pkgs.npm
  ];
  env = {};
  run = "npm install && npm start";
}
