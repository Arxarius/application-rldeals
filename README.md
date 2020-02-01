# RL Deals UI

## About 

This is the RL Deals UI repository. The repo controls all of the frontend and the connection to the API. 

## Initial setup

Installing the dependencies. Navigate to the root of the project using a terminal (GitBash).

```sh
$ npm install && npm run build
```

Alternatively you can use yarn.

```sh
$ yarn && yarn build
```

## Run the app

Running a simple dev version of the app is simple. Navigate to the root of the project using a terminal (GitBash). Setup a `.env` file based off of `.env.default`. 

If you don't have the api installed locally you will need to set the `REACT_APP_API_BASE_URL_ENV` to `development` This will point the API to the testing sever. However, this will fail due do `Access-Control-Allow-Origin` being disallowed. A simple solution is to download a browser extension that allows you to enable CORS and sends the `Access-Control-Allow-Origin: *` header with every request.

To run the frontend you can use the command

```sh
$ yarn app
```

This will run the previously built static version of the UI. The application will be served over `localhost` on port `3000` by default. 

## Committing Changes

Both `Master` & `Development` should not be committed to. These are used for deployment into their own respectful environments. New features and bug fixes should be branched off and then merged back into the relevant deployment branch. 

## testing Changes

Before deployment can happen you must be able to build a working version of the app inside of your branch. Once this works and has been merged then you will need to contact `Null` in order to get changes deployed.

The test server can be found here [142.93.231.167](http://142.93.231.167/).

## Compile Styles

TBC


---

> [rl.deals](https://rl.deals/) &nbsp;&middot;&nbsp;
> Twitter [@RLDeals](https://twitter.com/RLDeals)
