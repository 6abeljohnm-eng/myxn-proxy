{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.git
    pkgs.curl
    pkgs.wget
    pkgs.openssl
  ];

  env = {
    NODEJS_VERSION = "18";
    npm_config_update_notifier = "false";
    PATH = "/opt/nodejs/18/bin:$PATH";
  };
}
