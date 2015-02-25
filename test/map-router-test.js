'use strict';

var chai = require('chai');
var MapRouter = require('../lib/map-router').MapRouter;
var expect = chai.expect;

chai.config.includeStack = true;

describe('MapRouter tests', function() {

    it('should register a route', function() {
        var router = new MapRouter();
        expect(router.routes.GET).to.not.exist;
        router.register('get', '/testpath', function() {});
        expect(router.routes.GET).to.exist;
        expect(router.routes.GET.has('/testpath')).to.be.true;
    });

    it('should unregister a route', function() {
        var router = new MapRouter();
        expect(router.routes.GET).to.not.exist;
        router.register('get', '/testpath', function() {});
        expect(router.routes.GET).to.exist;
        router.unregister('get', '/testpath');
        expect(router.routes.GET.has('/testpath')).to.be.false;
    });

    it('should match default method', function() {
        var router = new MapRouter();
        expect(router.routes.GET).to.not.exist;
        router.register('get', '/testpath', function() {});
        expect(router.routes.GET).to.exist;
        expect(router.route('GET', '/testpath')).to.exist;
    });

    it('should match ALL', function() {
        var router = new MapRouter();
        expect(router.routes.ALL).to.not.exist;
        router.register('all', '/testpath', function() {});
        expect(router.routes.ALL).to.exist;
        expect(router.route('GET', '/testpath')).to.exist;
    });

    it('should not match missing method', function() {
        var router = new MapRouter();
        expect(router.routes.GET).to.not.exist;
        router.register('get', '/testpath', function() {});
        expect(router.routes.GET).to.exist;
        expect(router.route('POST', '/testpath')).to.be.false;
    });

    it('should register a route with shorthand method', function() {
        var router = new MapRouter();
        expect(router.routes.GET).to.not.exist;
        router.get('/testpath', function() {});
        expect(router.routes.GET).to.exist;
        expect(router.routes.GET.has('/testpath')).to.be.true;
    });

    it('should route with middleware', function(done) {
        var router = new MapRouter();
        var middleware = router.middleware();
        router.get('/testpath', function(req) {
            expect(req.path).to.equal('/testpath');
            done();
        });

        middleware({
            method: 'GET',
            path: '/testpath'
        }, {}, function() {
            // should not be called
            expect(false).to.be.true;
        });
    });

    it('should not route with middleware', function(done) {
        var router = new MapRouter();
        var middleware = router.middleware();
        router.get('/testpath', function() {
            // should not be called
            expect(false).to.be.true;
        });

        middleware({
            method: 'POST',
            path: '/testpath'
        }, {}, function() {
            done();
        });
    });
});