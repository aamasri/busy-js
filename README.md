<h1>Busy</h1>

<p>A beautiful animated loader with a js busy queuing system.</p>

<img src="https://auro.technology/uploads/auro/webpage/255/busy-spinner_thumb.jpg" width="200px" alt="">

<pre>
busy.start('fetching dinner', 30, true);    // modal spinner with 30 second timeout

window.setTimeout( function () {
    busy.stop('fetching dinner')            // stop spinner after 10 seconds
}, 10000);
</pre>

<br>
<h2>Features</h2>
<ul>
    <li>Easy to use.</li>
    <li>Lazy loading (small initial page load).</li>
    <li>Usable as a webpack/ES6 module or a pre-built browser bundle.</li>
    <li>Loaders can be 'modal', and are queued allowing for representation of multiple slow operations.</li>
</ul>


<br><br>
<h2>Demo</h2>
<a href="https://auro.technology/demos/busy">Try me</a>



<br><br>
<h2>Installation</h2>
Busy is a javascript package built for and using the ES6 module system, but it's also provided as a pre-built, minified browser package (in this package's "dist" folder).

<br>
<h3>Browser</h3>

1. Download & copy this package's "dist" folder into your web server's public folder eg. ```public/js/dist/*```.
2. Rename "dist" to "busy" eg. ```public/js/busy```
3. Load the busy script at the end of your web page (before the closing `body` tag) like this:
```
<body>
    ...

    <script src="/js/busy/busy.js"></script>
</body>
</html>

```
4. When the browser loads, busy will be attached to the browser's global window object. Use it anywhere in your scripts like this:
  
```
<button>Target</button>

<script>
    busy.start('test-1', 15);         // start a loader
    busy.start('test-2', 60);         // register another loader

    ...

    busy.stop('test-1');              // stop the specified loader
    
    ...
    
    busy.reset();                     // clear all loaders
</script>
```
    
<br>
<h3>ES6 module</h3>
Install the busy package into your project using npm: 
<pre>
$ cd to/your/project
$ npm install @aamasri/busy
</pre>

Then import and use it in your project's ES6 modules:
<h4>Static import</h4>
<pre>
import busy from 'busy';

function fetchDataFromApi() {
    busy.start('fetching data', 10, true);
}
</pre>

<h4>Dynamic import</h4>
Leveraging Webpack's on-demand (lazy) loading and code-splitting:
<pre>
import(/* webpackChunkName: "busy" */ 'busy').then((busy) => {
    busy.start('loading');
    
    fetch(api....)
        .then(data => {
            busy.stop('loading');
            
            ...
        })...
});
</pre>


<br><br>
<h2>Busy Functions</h2>
<pre>busy.start(id, timeout, modal)    // create a new loader instance</pre>
<pre>busy.stop(id)                     // stop a specific loader instance</pre>
<pre>busy.reset()                      // close all loaders (clear busy queue)</pre>
<pre>busy.queue                        // the actual busy queue object</pre>


<br><br>
<h2>Busy.start Options</h2>
<table>
<tr><th>Option</th><th>Type</th><th>Description</th><th>Default</th></tr>

<tr><td>id</td><td>string</td><td>unique id (enables it to be stopped later)</td><td>''</td></tr>
<tr><td>timeout</td><td>int | undefined</td><td>timeout (in seconds) after which loader will stop automatically.</td><td>7 seconds</td></tr>
<tr><td>modal</td><td>boolean | undefined</td><td>background blurring & dimming</td><td>false</td></tr>
</table>


<br><br>
<h2>Busy.stop Options</h2>
<table>
<tr><th>Option</th><th>Type</th><th>Description</th><th>Default</th></tr>

<tr><td>id</td><td>string</td><td>unique id (enabling a specific loader to be stopped)</td><td>''</td></tr>
</table>



<h2>Package Management</h2>

Busy supports [npm](https://www.npmjs.com/package/@aamasri/busy) under the name `@aamasri/busy`.

<h3>NPM</h3>
<pre>$ npm install @aamasri/busy --save</pre>

<br>
<h3>Dependencies</h3>
@aamasri/busy depends on 2 external packages:
<ol>
<li>jquery</li>
<li>@aamasri/dom-utils</li>
</ol>
These dependencies are bundled (as separate pre-built 'chunks') in this package's "dist" folder.  
<br>
Invoking the busy.start() function will dynamically load these dependencies at run-time (if these scripts don't already exist on the page) and they'll be added to the global window object.
<br><br>
If your page already loads the jQuery or @aamasri/dom-utils packages, busy will use them instead.


<br><br>

## Manual release steps
<ol>
<li>Increment the "version" attribute of `package.json`.</li>
<li>Re-build the browser output bundle...<pre>npm run build-production</pre>
...and observe that webpack completed with no errors.</li>
<li>Test the bundle by loading page: "dist/index.html" in a browser.</li>
<li>Commit <pre>git commit -a -m "Release version x.x.x - description"</pre></li>
<li>Tag the commit with its version number <pre>git tag x.x.x</pre></li>
<li>Change the "latest" tag pointer to the latest commit & push:
    <pre>git tag -f latest
git push origin master :refs/tags/latest
git push origin master --tags</pre>
<li>Publish to npm registry:<pre>npm publish</pre></li>
</ol>

<br>
<h2>Authors</h2>

* [Ananda Masri](https://github.com/aamasri)
* And awesome [contributors](https://github.com/aamasri/busy-js/graphs/contributors)
