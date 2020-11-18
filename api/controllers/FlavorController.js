/**
 * FlavorController
 *
 * @description :: Server-side logic for managing Flavors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";
var actionUtil = require("sails/lib/hooks/blueprints/actionUtil");
var Promise = require("bluebird");

var destroyAssetAndFile = function (asset, req) {
  return AssetService.destroy(asset, req)
    .then(AssetService.deleteFile(asset))
    .then(function () {
      return sails.log.info("Destroyed asset:", asset);
    });
};

var destroyAssetsAndFiles = function (version, req) {
  return version.assets.map(function (asset) {
    return destroyAssetAndFile(asset, req);
  });
};

var destroyVersion = function (version, req) {
  return VersionService.destroy(version, req).then(function () {
    return sails.log.info("Destroyed version:", version);
  });
};

var destroyVersionAssetsAndFiles = function (version, req) {
  return Promise.all(destroyAssetsAndFiles(version, req)).then(
    destroyVersion(version, req)
  );
};

var destroyFlavor = function (flavor, req) {
  return FlavorService.destroy(flavor, req).then(function () {
    return sails.log.info("Destroyed flavor:", flavor);
  });
};

module.exports = {
  /**
   * Overloaded blueprint function
   * Changes:
   *  - Delete all associated versions, assets & their files
   * @param {Object} req Incoming request object
   * @param {Object} res Outgoing response object
   */
  destroy: function (req, res) {
    var pk = actionUtil.requirePk(req);

    if (pk === "default") {
      res.serverError("Default flavor cannot be deleted.");
    } else {
      Flavor.findOne(pk).exec(function (err, flavor) {
        if (err) {
          res.serverError(err);
        } else if (!flavor) {
          res.notFound("No flavor found with the specified `name`.");
        } else {
          Version.find({ flavor: flavor.name })
            .populate("assets")
            .exec(function (err, versions) {
              if (err) {
                res.serverError(err);
              } else {
                Promise.map(versions, function (version) {
                  return destroyVersionAssetsAndFiles(version, req);
                })
                  .then(destroyFlavor(flavor, req))
                  .then(res.ok(flavor.name))
                  .error(res.negotiate);
              }
            });
        }
      });
    }
  },
};
