/*\
title: $:/plugins/padawanphysicist/mathjax/init.js
type: application/javascript
module-type: startup

Add LaTeX support through MathJax.

\*/
(function(){

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    function appendScriptElement(fn, attr, done) {
        var head = document.getElementsByTagName('head')[0] || document.documentElement;
        var res = document.createElement('script');
        if(typeof fn == 'function') {
            res[window.opera?'innerHTML':'text'] = '('+fn.toString()+')()';
        } else if(typeof fn == 'string'){
            res.src = fn;
        }
        if(attr) {
            for(var aname in attr) {
                if(attr.hasOwnProperty(aname)) {
                    res[aname] = attr[aname];
                }
            }
        }
        var loaded = false;
        res.onload = res.onreadystatechange = function(){
            if(!loaded && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                loaded = true;
                res.onload = res.onreadystatechange = null;
                if(head && res.parentNode){
                    head.removeChild(res);
                }
                if(typeof done == 'function') {
                    done();
                }
            }
        };
        head.insertBefore(res, head.firstChild);
        return res;
    }


    // Export name and synchronous status
    exports.name = "mathjax";
    exports.platforms = ["browser"];
    exports.after = ["startup"];
    exports.synchronous = false;

    exports.startup = function() {
        appendScriptElement("https://polyfill.io/v3/polyfill.min.js?features=es6");
        appendScriptElement("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
                            { id: "MathJax-script" },
                            function() {
                                // identify an element to observe
                                const storyRiver = document.querySelector(".tc-story-river");

                                // create a new instance of `MutationObserver` named `observer`,
                                // passing it a callback function
                                const observer = new MutationObserver(() => {
                                    MathJax.typesetClear()
                                    MathJax.startup.document.state(0);                                    
                                    MathJax.texReset();
                                    MathJax.typeset();
                                });

                                // call `observe()` on that MutationObserver instance,
                                // passing it the element to observe, and the options object
                                observer.observe(storyRiver, {subtree: false, childList: true});

                            });

        appendScriptElement(function(){
            MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    tags: 'ams'
                }
            };
            
        });
    };

    // End of plugin
})();

