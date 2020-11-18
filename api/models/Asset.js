/**
 * Asset.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
"use strict";
module.exports = {
  attributes: {
    id: {
      type: "string",
      primaryKey: true,
      unique: true,
    },

    name: {
      type: "string",
      required: true,
    },

    platform: {
      type: "string",
      enum: ["linux_32", "linux_64", "osx_64", "windows_32", "windows_64"],
      required: true,
    },

    filetype: {
      type: "string",
      required: true,
    },

    hash: {
      type: "string",
    },

    size: {
      type: "integer",
      required: true,
    },

    download_count: {
      type: "integer",
      defaultsTo: 0,
    },

    version: {
      model: "version",
      required: true,
    },

    // File descriptor for the asset
    fd: {
      type: "string",
      required: true,
    },
  },

  autoPK: false,

  beforeCreate: function (asset, proceed) {
    // const { version, platform, filetype } = asset;
    var version = asset.version;
    var platform = asset.platform;
    var filetype = asset.filetype;

    asset.id = `${version}_${platform}_${filetype.replace(/\./g, "")}`;

    return proceed();
  },
};
