## Types of Requests

### browser requesting a page
- server recieves a request (server-side render) for `req.url` (path)
  - `req.url` -> `PageRequest { url, pattern, params, ... }`
- compiler compiles server and client bundles for the page
  - only compiles related bundles for the page (dynamic entry)
  - will not compile (on file change)
    unless the request for the related page/entry is received
  - skip the compilation if no change (file system)
    i.e. reloading the page will not recompile the bundle
  - (maybe server "requests" the compiler to do it for a page)
    ? treat compiler as an external service (latency == compilation)
- server holds the response until the compilation for the route is ready
  - both server and client compilations
  - server -> to render html document
    (`PageRenderer` depends on `ServerCompiler`) {per request if compilation in progress}
  - client -> to create static assets i.e. bundles
- server renders html with:
  - server render bundle (handler)
  - compilation stats for the page --- what if we don't recompile?
- browser received the html document
- browser request static files e.g. bundle `main.1234.js`
  - from the link, script tags in the html document
  - server serves the static bundles
  - 404 if EACCES or ENOENT (opaque to the client - maybe)

note: requesting a page will kicks off the compilation (might not if optimize
for no change) then the document will generates more requests for static assets.
We do not want to compile for static asset requests since we already did
on the page request.

### client-side nagivation from page to another page
- e.g. inbox -> message (email)
- WIP ...
- ... the bundles for the page have not been built ...
- ... the trigger might be (on-demand) "static asset" requests ...

### Current issues on On-demand Entries Handling

The problem is that `hooks.make` is when we add dynamic entry 
the hook is "registered" once which means it's a singleton function
on the compiler and cannot be change between each compilation.

`options.entry` cannot be change between compilation. You can pass function
entry but it doesn't take any argument which means you still have to rely
on the global/closure mutable object so the singleton "entry" function
will return different result each time it runs.

Relying on mutable object is dangerous because the thing that sets the entries
and the compilation has to be in sync (think if we get many requests while the compilation is in flight)

A better way is to pass entry for each webpack "run" but there's no way to do that.
