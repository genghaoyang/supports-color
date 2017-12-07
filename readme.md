# supports-color [![Build Status](https://travis-ci.org/chalk/supports-color.svg?branch=master)](https://travis-ci.org/chalk/supports-color)

> Detect whether a terminal supports color  检测终端是否支持颜色
## Install

```
$ npm install supports-color
```


## Usage

```js
const supportsColor = require('supports-color');

if (supportsColor.stdout) {
	console.log('Terminal stdout supports color');
}

if (supportsColor.stdout.has256) {
	console.log('Terminal stdout supports 256 colors');
}

if (supportsColor.stderr.has16m) {
	console.log('Terminal stderr supports 16 million colors (truecolor)');
}
```


## API

Returns an `Object` with a `stdout` and `stderr` property for testing either streams. Each property is an `Object`, or `false` if color is not supported.返回与stdout和stderr测试流属性的对象。每个属性都是一个对象，如果不支持颜色，则为false。

The `stdout`/`stderr` objects specifies a level of support for color through a `.level` property and a corresponding flag:
的` stdout ` / ` stderr `对象指定一级支持颜色通过`。水平`属性和相应的标志
- `.level = 1` and `.hasBasic = true`: Basic color support (16 colors)
- `.level = 2` and `.has256 = true`: 256 color support
- `.level = 3` and `.has16m = true`: Truecolor support (16 million colors)
- `。水平= 1 `和`。必要=真正的`：基本支持彩色（16色）
- `。水平= 2 `和`。has256 =真正的`：支持256色
- `。水平= 3 `和`。has16m =真正的`支持：真彩色（1600万色）

## Info

It obeys the `--color` and `--no-color` CLI flags. 它遵从‘颜色’和‘没有颜色’的CLI标志。

Can be overridden by the user with the flags `--color` and `--no-color`. For situations where using `--color` is not possible, add the environment variable `FORCE_COLOR=1` to forcefully enable color or `FORCE_COLOR=0` to forcefully disable. The use of `FORCE_COLOR` overrides all other color support checks.
用户可以用标志“颜色”和“没有颜色”来覆盖。的情况下，使用` --颜色`是不可能的，添加环境变量` force_color = 1 `强行使颜色或` force_color = 0 `强行禁用。对` force_color `凌驾于所有其他颜色支持使用支票

Explicit 256/Truecolor mode can be enabled using the `--color=256` and `--color=16m` flags, respectively.
明确256 /真彩模式可以使用` --颜色= 256 `和` --颜色= 16m `旗帜，分别。


## Related

- [supports-color-cli](https://github.com/chalk/supports-color-cli) - CLI for this module
- [chalk](https://github.com/chalk/chalk) - Terminal string styling done right


## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Josh Junon](https://github.com/qix-)


## License

MIT
