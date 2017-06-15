server {
  listen {{port}};
  #rewrite_log on;
  #access_log /var/log/nginx/2dfire.access.log;
  #error_log /var/log/nginx/2dfire.error.log notice;

  server_name 127.0.0.1;

  location ^~ / {
    rewrite ^/([^/]*/api/.*)$ /whereask/$1 last;
    rewrite ^/(.*)$ /dev/$1;
  }
  location /whereask/ { proxy_pass http://api.l.whereask.com/; }
  location /build/ {
    rewrite ^/build/[^/]*/({{localApps}})/(.*)$  /build/static-$1/release/min/$2 last;
    rewrite ^/build/(.*)$ /whereask/$1 last;
    alias {{projectsCWD}};
  }

  location /__webpack_hmr { rewrite ^/(.*)$ /dev/{{webpackHmrApp}}/$1; }

  # laboratory: 8084
  # react-component: 8083

  location /dev/ {
    rewrite ^/dev/[^/]*/({{localApps}})/(.*)$ /dev/$1/$2 last;
  }
  location /dev/shop/ { proxy_pass http://localhost:8086/; }
  location /dev/bill/ { proxy_pass http://localhost:8089/; }
  location /dev/marketing/ { proxy_pass http://localhost:8085/; }
  location /dev/meal/ { proxy_pass http://localhost:8088/; }
  location /dev/om/ { proxy_pass http://localhost:8087/; }
}
