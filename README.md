# nimman (work in progress)
A(nother prototype) Server-side Render Web Server Framework of mine.

Written for Node 8 or higher.

## To Develop

```sh
$ yarn
$ tsc
$ node dist/example
```

## Thoughts

- "render" layer should be network (req, res) ignorant. Merely taking what it should render, renders it, and return the string result.
