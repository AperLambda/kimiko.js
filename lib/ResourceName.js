/*
 * Copyright © 2018 AperLambda <aperlambda@gmail.com>
 *
 * This file is part of kimiko.js.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

// NOTE: this file might be moved to a JS version of λcommon

const ResourceName = module.exports = class ResourceName {
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
