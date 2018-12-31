# kimiko.js

![JS](https://img.shields.io/badge/language-JS-9B599A.svg?style=flat-square)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/AperLambda/kimiko.js/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/AperLambda/kimiko.js.svg?style=flat-square)](https://github.com/AperLambda/kimiko.js/issues/)

A command system written in JavaScript, based on [kimiko](https://github.com/AperLambda/kimiko/). It has the advantage to be very flexible.

It handles command usage, description, aliases and subCommand propagation.

The command names are encoded as ResourceNames: they are of the form `domain:name`. This allows for several commands of different sources to have the same name.

## Installation & Usage

You can install this library from `npm`:

```sh
npm i kimiko
```

Once it has been installed, you just need to require it in you code:

```js
const kimiko = require("kimiko");
```

All of the classes will be contained in `kimiko`. All you then have to do is to implement it.
