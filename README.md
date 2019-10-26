# Razzle With Docker Nginx Example

## How to use
Download the example [or clone it](https://github.com/fivethreeo/razzle-with-docker-nginx.git):

```bash
curl https://codeload.github.com/fivethreeo/razzle-with-docker-nginx/tar.gz/master | tar -xz razzle-with-docker-nginx-master
cd razzle-with-docker-nginx-master
```

Run:

```bash
sudo -E docker-compose -f docker-compose.yml up --build
```

## Idea behind the example
This is a basic, bare-bones example of how to use razzle. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser.
