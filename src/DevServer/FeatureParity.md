# List of Features to Implement

## [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware/tree/dba5e02876bb76d2301c93d20ec90f558147d5b4)

- [ ]
- [ ]

## [`webpack-hot-server-middleware`](https://github.com/60frames/webpack-hot-server-middleware/tree/1d4306c9efab722e4b12ea38752e4e6855e36816)

- [ ] Hot reload server bundle as it's recompiled without needing to restart DevServer
  - [ ] get output server bundle filename from stats (no hardcoding)
  - [ ] "require" the file and validate the exported `renderer`
    (can we `delete require.cache[require.resolve(filepath)]` instead of using `requireFromString`?)
  - [ ] replace the `renderer` when new server compilation is done
  - [ ] client and server compilation stats are passed to the `renderer`
  - ? how to handle multi-page app render function (is it a thing?)
- [ ] Support server bundle source map
