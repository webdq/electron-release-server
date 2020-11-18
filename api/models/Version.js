/**
 * Version.js
 *
 * @description :: Represents a release version, which has a flavor, contains assets and is a member of a channel
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

    assets: {
      collection: "asset",
      via: "version",
    },

    channel: {
      model: "channel",
      required: true,
    },

    availability: {
      type: "datetime",
    },

    flavor: {
      model: "flavor",
      defaultsTo: "default",
    },

    notes: {
      type: "string",
    },
  },

  autoPK: false,

  beforeCreate: function (version, proceed) {
    // const { name, flavor } = version;
    var name = version.name;
    var flavor = version.flavor;

    version.id = `${name}_${flavor}`;

    return proceed();
  },

  afterCreate: function (version, proceed) {
    // const { availability, createdAt, id } = version;
    var availability = version.availability;
    var createdAt = version.createdAt;
    var id = version.id;

    if (!availability || new Date(availability) < new Date(createdAt)) {
      return Version.update(id, { availability: createdAt }).exec(proceed);
    }

    return proceed();
  },
};
