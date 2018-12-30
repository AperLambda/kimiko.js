

const CommandResult = module.exports = class CommandResult {
  constructor(callable)
  {
    if (!typeof callable == "function") {
      throw new Error(`kimiko.js, new CommandResult(callable): 'callable' should be a function, got ${typeof callable}.`);
    }
    this.callable = callable;
  }

  call()
  {
    try {
      this.callable();
    }
    catch (e) {
      console.error("kimiko.js: CommandResult execution failed", e);
    }
  }
}

CommandResult.ERROR_PERMISSION = new CommandResult(() => "translate:error.permission");
CommandResult.ERROR_USAGE = new CommandResult(() => "translate:error.usage");
CommandResult.ERROR_RUNTIME = new CommandResult(() => "translate:error.runtime");
