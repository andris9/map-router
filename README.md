# MapRouter

**MapRouter** is a simple and fast *exact-match* router middleware for Express that can be used instead of the built-in router.

Requires Node v0.12 or iojs. The module does not run on Node v0.10 as it uses [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) constructor which is not enabled by default (you might get it working with the `--harmony` flag though).

The goals of this router are:

  * Should be very fast
  * Routes can be added dynamically
  * Routes can be removed dynamically

The sacrifices for achieving the goals are:

  * Only exact matches, no regular expressions or variable support

This router is suitable for scenarios where you need to add and remove routes very often in runtime.

## Usage

Install with npm

    npm install map-router

Require in your script

    var MapRouter = require('map-router');

Create MapRouter instance

```javascript
var router = new MapRouter();
```

Attach the router to Express

```javascript
app.use(router.middleware());
```

### Add a new Route

```javascript
router.register(method, path, handler)
```

Where

  * **method** is the method to use or `'ALL'` for matching all methods
  * **path** is the path to the route (eg. `'/path/to/handler'`)
  * **handler** is the route handler

**Example**

```javascript
var express = require('express');
var app = express();
var MapRouter = require('map-router');
var router = new MapRouter();

app.use(router.middleware());

router.register('GET', '/', function(req, res){
    res.send('hello world');
});
```

Alternatively you can register handlers with shorthand wrappers where method is the function name:

```javascript
router.get('/', function(req, res){
    res.send('hello world');
});
```

### Remove a Route

```javascript
router.unregister(method, path)
```

Where

  * **method** is the method to use or `'ALL'` for matching all methods
  * **path** is the path to the route (eg. `'/path/to/handler'`)

### Find a Route for a Path

If you are not using the Express compatible middleware but want to do your own routing, you can do this with

```javascript
var handler = router.route(method, path)
```

Where

  * **method** is the method to use or `'ALL'` for matching all methods
  * **path** is the path to the route (eg. `'/path/to/handler'`)
  * **handler** is the resolved handler function or false if the route was not found

## License

**MIT**
