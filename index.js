//引入模块OS 
const os = require('os');
//引入模块has-flag 
const hasFlag = require('has-flag');
//返回一个包含用户环境信息的对象
const env = process.env;

//translateLevel 方法的具体内容
function translateLevel(level) {
	//如果变量 level等于0返回false
	if (level === 0) {
		return false;
	}
	//返回 变量level，支持16色，256色，和1600万色
	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

// supportsColor 方法的具体内容
function supportsColor(stream) {
	//如果不支持终端颜色返回0
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return 0;
	}
	//如果支持终端16色返回3
	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}
	//如果支持终端256色返回2
	if (hasFlag('color=256')) {
		return 2;
	}

	//总是支持终端彩色返回1
	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return 1;
	}
	//当终端不是是isTTY返回0
	if (stream && !stream.isTTY) {
		return 0;
	}
	//如果系统是win32位的
	if (process.platform === 'win32') {
		//Node.js 7.5.0是Node.js包含补丁的第一个版本libuv使Windows 256的彩色输出。任何更早的事情行不通
		//然而，在这里我们的目标Node.js 8至少是一个LTS释放Node.js不。Windows 10构建10586是第一个窗口
		//支持256种颜色的版本Windows 10构建14931是第一个版本支持57真彩。
		// Node.js 7.5.0 is the first version of Node.js to include a patch to  
		// libuv that enables 256 color output on Windows. Anything earlier and it   
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		
		//拿到的操作系统的发行版以.分割
		const osRelease = os.release().split('.');
		//如果系统是大于8，或者10返回1，
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			//返回 构建的如果大于等于14931，返回3，小于返回2
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}
	
	//如果 环境变量是 ci的返回0
	if ('CI' in env) {
		//如果为TRAVIS、CIRCLECI、APPVEYOR、GITLAB_CI与环境变量sign相同或者环境变量为codeship时返回1
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return 0;
	}

	//如果TEAMCITY_VERSION的版本符合规则返回1，否则返回0
	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	//如果环境变量为TERM_PROGRAM 的
	if ('TERM_PROGRAM' in env) {
		//获取版本号
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
		// 选择 环境变量为TERM_PROGRAM的版本
		switch (env.TERM_PROGRAM) {
			//如果版本为iTerm.app，获取当前版本大于等于3的返回3，反之返回2
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			//如果版本为Hyper，返回3
			case 'Hyper':
				return 3;
			//如果版本为Apple_Terminal，返回2
			case 'Apple_Terminal':
				return 2;
			//没有默认版本
			// No default
		}
	}
	//如果是-color=256标志，他的作用是来启用 返回2
	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	//如果环境变量为COLORTERM的返回1
	if ('COLORTERM' in env) {
		return 1;
	}
	//如果环境变量为dumb 的返回0
	if (env.TERM === 'dumb') {
		return 0;
	}

	return 0;
}

// 方法为 getSupportLevel的具体内容
function getSupportLevel(stream) {
	//获取 supportsColor方法的返回值
	let level = supportsColor(stream);

	//使用FORCE_COLOR覆盖所有其他颜色支持检查
	if ('FORCE_COLOR' in env) {
		level = (env.FORCE_COLOR.length > 0 && parseInt(env.FORCE_COLOR, 10) === 0) ? 0 : (level || 1);
	}
	//返回translateLevel方法的返回值
	return translateLevel(level);
}

//初始化
module.exports = {
	supportsColor: getSupportLevel,
	//终端标准输出支持多少颜色请输出到终端
	stdout: getSupportLevel(process.stdout),
	//终端stderr支持多少颜色请输出到终端
	stderr: getSupportLevel(process.stderr)
};
