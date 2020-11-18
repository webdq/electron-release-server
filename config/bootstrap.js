/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

const mapSeries = require("async/mapSeries");
const waterfall = require("async/waterfall");
const series = require("async/series");

module.exports.bootstrap = function (done) {
  series(
    [
      // Create configured channels in database
      function (cb) {
        return mapSeries(
          sails.config.channels,
          function (name, next) {
            waterfall(
              [
                function (next) {
                  Channel.find(name).exec(next);
                },
                function (result, next) {
                  if (result.length) return next();

                  Channel.create({ name }).exec(next);
                },
              ],
              next
            );
          },
          cb
        );
      },

      // Populate existing versions without availability date using version creation date
      function (cb) {
        return Version.find({ availability: null }).then(function (versions) {
          return mapSeries(
            versions,
            function (payload, next) {
              Version.update(payload.id, {
                availability: payload.createdAt,
              }).exec(next);
            },
            cb
          );
        });
      },

      // Create configured flavors in database
      function (cb) {
        return mapSeries(
          sails.config.flavors,
          function (name, next) {
            waterfall(
              [
                function (next) {
                  Flavor.find(name).exec(next);
                },
                function (result, next) {
                  if (result.length) return next();

                  Flavor.create({ name }).exec(next);
                },
              ],
              next
            );
          },
          cb
        );
      },

      // Update existing versions and associated assets in database with default flavor data
      function (cb) {
        return Version.update({ flavor: null }, { flavor: "default" }).exec(
          function (err, updatedVersions) {
            return mapSeries(
              updatedVersions,
              function (payload, next) {
                Asset.update(
                  { version: payload.name },
                  { version: payload.id }
                ).exec(next);
              },
              cb
            );
          }
        );
      },
    ],
    done
  );
};
