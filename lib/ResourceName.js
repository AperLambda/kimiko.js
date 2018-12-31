/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

// NOTE: this file might be moved to a JS version of λcommon

/**
 * The ResourceName class; it is a discrete type describing a command name. It is made out of two parts: the domain and the actual name.
 * Its syntax is the following: `domain:name`. Any ResourceName not following this syntax will not be recognized.
 * This type can quickly be shifted into its string form
 * @example
 * let name = new kimiko.ResourceName("josh:help");
 *
 * console.log(name.domain); // "josh"
 * console.log(name.name); // "help"
 *
 * console.log(name); // "josh:help"
 * console.log(name == "josh:help"); // true
 * console.log(name.equals("josh:help")); // true
 *
 * let name2 = new kimiko.ResourceName(name);
 * console.log(name == name2); // true
 * console.log(name.equals(name2)); // true
 */
class ResourceName {
  /**
   * @param {(String|ResourceName)} raw The raw version of the ResourceName; if it is a ResourceName, it will be parsed down to a string beforehand
   * @throws Will throw if the ResourceName is not valid
   */
  constructor(raw)
  {
    if (raw instanceof ResourceName) {
      return new ResourceName(raw.toString());
    }
    let split = raw.split(":");
    if (split.length != 2 || !split[0].length || !split[1].length) {
      throw new Error("kimiko.js, ResourceName::new(raw): parse error, ResourceName should be of the form 'domain:name'");
    }
    this.domain = split[0];
    this.name = split[1];
  }

  /**
   * Returns whether or not the current ResourceName instance is equal to `raw`
   * @param {(String|ResourceName)} raw
   * @return {boolean}
   */
  equals(raw)
  {
    if (typeof raw == "string") {
      let split = raw.split(":");
      if (split.length != 2) return false;
      return this.domain === split[0] && this.name === split[1];
    } else if (raw instanceof ResourceName) {
      return raw.domain == this.domain && raw.name == this.name;
    }
    return false;
  }

  /**
   * Converts the ResourceName to a String; it is also used by `Symbol.toPrimitive` and `toJSON`
   * @return {String} The parsed ResourceName, in the `domain:name` form
   */
  toString()
  {
    return this.domain + ":" + this.name;
  }

  [Symbol.toPrimitive](hint)
  {
    return this.toString();
  }

  toJSON()
  {
    return this.toString();
  }
}

module.exports = ResourceName;
