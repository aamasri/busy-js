<h1>Dom Utils</h1>

<p>A collection of DOM utils to add syntactic sugar and supplement jQuery.</p>

<p>This is <strong>not</strong> an (ES5) browser package.  It's an ES6 source module designed to be 'imported' into a javascript project that's transpiled using babel & webpack.</p>



<br>

<h2>Utility Function List</h2>
<ul>
    <li><a href="#async-ready"><code>ready().then(...)</code></a> - deferred document ready.</li>
    <li><a href="#async-loaded"><code>loaded().then(...)</code></a> - deferred window loaded.</li>
    <li><a href="#cache"><code>$cache()</code></a> - providing $(window), $(document), and $('body').</li>
    <li><a href="#isiniframe"><code>isInIframe()</code></a> - is our code running inside an iframe?</li>
    <li><code>isTouchDevice()</code></li>
    <li><code>isMobile()</code></li>
    <li><code>isVisible(element)</code> - whether element is visible in the viewport or scrolled out of view.</li>
    <li><a href="#getviewportoffsetelement"><code>getViewportOffset(element)</code></a> - top, right, bottom, left offsets from viewport.</li>
    <li><a href="#ontopzindex"><code>onTopZIndex()</code></a> - for new elements to be displayed on top.</li>
    <li><a href="#getzindexelement-recursive"><code>getZIndex(element)</code></a> - provides layer information.</li>
    <li><a href="#getappliedstyleelement-style"><code>getAppliedStyle(element, style)</code></a> - computed style.</li></li>
    <li><a href="#webpsupportfeature"><code>webpSupport()</code></a> - whether the browser supports webP images.</li></li>
    <li><a href="#screenresolution"><code>screenResolution()</code></a> - returns 'lo', 'med' or 'hi' (to support a responsive image system).</li>
    <li><a href="#hashcontent"><code>hash(content)</code></a> - fast hash code generator.</li>    
</ul>


<br>
<h2>Usage Examples</h2>

<a name="async-ready"></a>
<h3>async ready()</h3>
Defer script execution until the DOM is ready. Implements the Promise interface.

<pre>import { ready } from '@aamasri/dom-utils';

ready().then(function() { 
    alert('Your browser is ready to run scripts...');
});</pre>


<a name="async-loaded"></a>
<h3>async loaded()</h3>
Allows script execution to be deferred until after the initial page render. Implements the Promise interface.

<pre>import { loaded } from '@aamasri/dom-utils';

loaded().then(function() {
    domUtils.loaded().then(function() { 
        alert('Your browser has finished loading (including images)...');
    });
});</pre>


<a name="cache"></a>
<h3>$cache()</h3>
Re-use the core jQuery objects (may save some overhead). Provides the $(window), $(document), and $('body') jQuery objects.

<pre>import { $cache } from '@aamasri/dom-utils';

let windowWidth = $cache().$window.width();</pre>



<a name="isiniframe"></a>
<h3>isInIframe()</h3>
Enables check in case our code is running inside an iframe. This can avoid the problem where a functions fails because it is unavailable inside the iframe. 

<pre>import { isInIframe } from '@aamasri/dom-utils';

if (isInIframe) {
    parent.showMessage('I'm executing a parent window function');
} else {
    alert('This is in the iframe');
}</pre>



<a name="getviewportoffsetelement"></a>
<h3>getViewportOffset(element)</h3>
<p>Returns the top, right, bottom, left offsets of the element (relative to the viewport).</p> 
<p>For example, a negative offset means that the element is scrolled out of view.</p>
<p>This function is also useful in positioning another element relative to the specified element.</p>   

<pre>import { getViewportOffset } from '@aamasri/dom-utils';

const target = window.getElementById('submitButton');
const targetOffsets = getViewportOffset(target);    // target can be a DOM element or jQuery object

if (targetOffsets.top < 0 || targetOffsets.bottom < 0) {
    target.scrollIntoView();
}</pre>


<a name="ontopzindex"></a>
<h3>onTopZIndex()</h3>
<p>Returns the highest z-index value on the page.</p> 
<p>This is useful for popup dialog boxes (or notifications) that need to display on-top of everything else already on the page.</p>   

<pre>import { onTopZIndex } from '@aamasri/dom-utils';

$dialog.css({ 'position', 'absolute', 'z-index', onTopZIndex() + 1 });  // position dialog box on top</pre>



<a name="getzindexelement-recursive"></a>
<h3>getZIndex(element, recursive)</h3>
<p>Gets the z-index style applied to an element.</p>
<p>More usefully (because parent z-index affects descendants), set the recursive option true for the <strong>effective</strong> z-index (ie. the element's ancestry).</p>   

<pre>import { getZIndex } from '@aamasri/dom-utils';

const dialogLayer = getZIndex(dialog, true);</pre>



<a name="getappliedstyleelement-style"></a>
<h3>getAppliedStyle(element, style)</h3>
<p>Slightly easier to use than the native window.getComputedStyle() function.</p>

<pre>import { getAppliedStyle } from '@aamasri/dom-utils';

const buttonVisible = getAppliedStyle(button, 'display') !== 'none';</pre>





<a name="webpsupportfeature"></a>
<h3>webpSupport(feature)</h3>
<p>As of 2021 full browser support for webp images is ~95%. Nevertheless, with Safari only recently offering full
support and considering many older IOS devices (which simply can't be upgraded), this function will probably be useful 
through 2024.</p> 

This function checks for specific feature support (alpha by default) because  some browsers added features incrementally
with lossy image support added first, followed by lossless & alpha, and finally support for animated images.</p>

<pre>
import { webpSupport } from '@aamasri/dom-utils';

// eg. check for full webp support including animation
webpSupport('animation').then(msg => {
    window.browserInfo.webpSupport = true;
    console.log(msg);
}).catch(errorMessage => {
    window.browserInfo.webpSupport = false;
    console.info(errorMessage);
    stripWebp();    // remove unsupported responsive webp images from srcset
});
</pre>




<a name="screenresolution"></a>
<h3>screenResolution()</h3>
<p>Part of a system to determine the optimal image resolution for a given device.</p>
<p>Returns 'lo', 'med' or 'hi' based on the size of the browser viewport.</p>

<pre>import { screenResolution } from '@aamasri/dom-utils';

const resolution = screenResolution();

wallpaper.src = \`/img/wallpaper-${resolution}.jpg\`;</pre>





<a name="hashcontent"></a>
<h3>hash(content)</h3>
<p>A simple, fast (faster than md5 etc) hash code generator.</p>

<pre>import { hash } from '@aamasri/dom-utils';

const initialContent = $input.val();
const initialContentSignature = hash(initialContent);

$input.on('change', function() {
    const newContent = $input.val();
    const newContentSignature = hash(newContent);

    if (newContentSignature !== initialContentSignature)
        alert('the input value changed');
});




wallpaper.src = \`/img/wallpaper-${resolution}.jpg\`;</pre>




<br><br>

<h2>Installation</h2>
Dom-utils is an ES6 source module intended to be imported into your ES6 projects - prior to transpiling into a browser bundle with Babel/Webpack.

<pre>$ cd to/your/project
$ npm install @aamasri/dom-utils --save-dev</pre>

Then import and use it in your project's ES6 modules:
<h4>Static import</h4>
<pre>
import { ready, loaded, isVisible } from '@aamasri/dom-utils';

ready().then(function() {
    alert('Your browser is ready to run scripts...')
});
</pre>

<h4>Dynamic import</h4>
Leveraging Webpack's on-demand (lazy) loading and code-splitting:
<pre>
import(/* webpackChunkName: "dom-utils" */ '@aamasri/dom-utils').then((domUtils) => {
    domUtils.loaded().then(function() { 
        alert('Your browser has finished loading (including images)...')
    });
});
</pre>


<br><br>


<h2>Package Management</h2>

Dom-utils supports [npm](https://www.npmjs.com/package/dom-utils) under the name `@aamasri/dom-utils`.

<br>
<h3>Dependencies</h3>
Some of the utility functions depend on the jQuery package.


<br><br>

## Manual release steps
<ol>
<li>Increment the "version" attribute of `package.json`.</li>
<li>Increment the version number in the `dom-utils.js` file.</li>
<li>Commit <pre>git commit -a -m "Release version x.x.x - description"</pre></li>
<li>Tag the commit with it's version number <pre>git tag x.x.x</pre></li>
<li>Change the "latest" tag pointer to the latest commit & push:
    <pre>git tag -f latest
git push origin master :refs/tags/latest
git push origin master --tags</pre>
<li>Publish to npm registry:<pre>npm publish</pre></li>
</ol>

<br>
<h2>Authors</h2>

* [Ananda Masri](https://github.com/aamasri)
* And awesome [contributors](https://github.com/aamasri/dom-utils/graphs/contributors)
