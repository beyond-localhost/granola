# Granola

The Todo management program made with [wails](https://wails.io/) and [react.js](https://react.dev). For your information, check out [my retrospection(KR)](https://nemyung.tistory.com/26).

## DEMO

The demo is linked on the youtube. You can click the thumbnail.
<br />

[![granola demo](https://img.youtube.com/vi/FCIcpmHW9Cg/0.jpg)](https://www.youtube.com/watch?v=FCIcpmHW9Cg)



## Quick start

### Granola

For running on development, you need to install the [GO 1.18+](https://go.dev/doc/install) first.

```sh
$ make dev
```

<br />

For building this project:

```sh
$ make build
```

<br />

Wails have many options to build upon different [platform](https://wails.io/docs/reference/cli#platforms). I manage the script in the MakeFile, so it is recommend to modify it and build depending on your machine. Currently, I tested only darwin/arm64. If you have a problem during opening the artifact, I recommend to run it on the development.
