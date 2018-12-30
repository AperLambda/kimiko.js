

const Command = require("./command");

const CommandBuilder = module.exports = class CommandBuilder {
  constructor(name)
  {
    this.name = name;
    this.usage = null;
    this.description = null;
    this.aliases = [];
    this.permissionRequired = null;
    this.executor = null;
  }

  setUsage(usage)
  {
    this.usage = usage;
    return this;
  }

  setDescription(description)
  {
    this.description = description;
    return this;
  }

  setAliases(aliases)
  {
    this.aliases = aliases;
    return this;
  }

  setPermissionRequired(permissionRequired)
  {
    this.permissionRequired = permissionRequired;
    return this;
  }

  setExecutor(executor)
  {
    this.executor = executor;
    return this;
  }

  setTabCompleter(tabCompleter)
  {
    this.tabCompleter = tabCompleter;
    return this;
  }

  build()
  {
    let command = new Command(this.name);
    if (this.usage) command.setUsage(this.usage);
    if (this.description) command.setDescription(this.description);
    if (this.aliases) command.setAliases(this.aliases);
    if (this.permissionRequired) command.setPermissionRequired(this.permissionRequired);
    if (this.executor) command.setExecutor(this.executor);
    if (this.tabCompleter) command.setTabCompleter(this.tabCompleter);
    return command;
  }
}
