/**
 * Channel.js
 *
 * @description :: Various release channel (ex. stable & dev)
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
"use strict";
module.exports = {
  attributes: {
    name: {
      type: "string",
      primaryKey: true,
      unique: true,
      required: true,
    },
  },
  autoPK: false,
};
