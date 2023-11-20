const Log = {
	info: function info(message) {
		const callerInfo = getFileName(info.caller.name);
		console.log(
			new Date().toLocaleString() +
				' [' +
				arguments.callee.name.toUpperCase() +
				'] ' +
				callerInfo.filename +
				':' +
				callerInfo.line +
				':' + 
				callerInfo.column +
				' ' + "\n   " +
				info.caller.name +
				'() ' +
				message
		);
	},
    error: function error(message) {
        const callerInfo = getFileName(error.caller.name);
		console.log(
			new Date().toLocaleString() +
				' [' +
				arguments.callee.name.toUpperCase() +
				'] ' +
				callerInfo.filename +
				':' +
				callerInfo.line +
				':' + 
				callerInfo.column +
				' ' + "\n   " +
				error.caller.name +
				'() ' +
				message
		);
    }
};

function getFileName(caller) {
  const STACK_FUNC_NAME = new RegExp(/at\s+((\S+)\s)?\((\S+):(\d+):(\d+)\)/);
	let err = new Error();
	
	Error.captureStackTrace(err);

	let stacks = err.stack.split('\n').slice(1);

	let callerInfo = null;
	for (let i = 0; i < stacks.length; i++) {
		callerInfo = STACK_FUNC_NAME.exec(stacks[i]);
    
		if (callerInfo[2] === caller) {
			return {
				filename: callerInfo[3],
				line: callerInfo[4],
				column: callerInfo[5],
			};
		}
	}

	return null;
}

module.exports = Log