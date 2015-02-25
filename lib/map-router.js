'use strict';

module.exports.MapRouter = MapRouter;

/**
 * Creates a new router instance
 *
 * @constructor
 */
function MapRouter() {
    this.routes = {};
}

/**
 * Registers a new route. The method 'ALL' is a special case – if a route is not found
 * for the selected method (eg. 'GET') then 'ALL is also checked.
 *
 * @param {String} method Method to use (eg 'GET')
 * @param {String} path Route path (eg. '/path/to/route')
 * @param {Function} handler Function to run when the route matches
 */
MapRouter.prototype.register = function(method, path, handler) {
    method = (method || 'GET').toUpperCase().trim();

    if (!this.routes[method]) {
        this.routes[method] = new Map();
    }

    this.routes[method].set(path, handler);
};

/**
 * Removes a route from the routing table
 *
 * @param {String} method Method to use (eg 'GET')
 * @param {String} path Route path (eg. '/path/to/route')
 */
MapRouter.prototype.unregister = function(method, path) {
    method = (method || 'GET').toUpperCase().trim();

    if (this.routes[method] && this.routes[method].has(path)) {
        this.routes[method].delete(path);
    }
};

/**
 * Find a handler for a route. If it doesn't find a route for the selected method, then it
 * also tries 'ALL'
 *
 * @param {String} method Method to use (eg 'GET')
 * @param {String} path Route path (eg. '/path/to/route')
 * @returns {Function} Route handler or false if not found
 */
MapRouter.prototype.route = function(method, path) {
    method = (method || 'GET').toUpperCase().trim();

    if (this.routes[method] && this.routes[method].has(path)) {
        return this.routes[method].get(path);
    } else if (method !== 'ALL' && this.routes.ALL && this.routes.ALL.has(path)) {
        return this.routes.ALL.get(path);
    }

    return false;
};

/**
 * Returns express middleware
 * @returns {[type]} [description]
 */
MapRouter.prototype.middleware = function() {
    var selfie = this;

    return function(req, res, next) {

        var route = selfie.route(req.method, req.path);

        if (!route) {
            // nothing to do here
            return next();
        }

        route(req, res);

    };
};

// Set convinience wrappers
['all', 'get', 'post', 'put', 'delete'].forEach(function(method) {
    MapRouter.prototype[method] = function(path, handler) {
        this.register(method.toUpperCase(), path, handler);
    };
});