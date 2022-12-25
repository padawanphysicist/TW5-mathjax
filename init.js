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
    console.log("Init MathJax plugin");
    appendScriptElement(function(){
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [
                    ['$','$'],
                    ['\\\\(','\\\\)']
                ]
            }
        });
	
    }, {type: 'text/x-mathjax-config'});
    appendScriptElement("https://polyfill.io/v3/polyfill.min.js?features=es6", null, function() { console.log("Included Polyfill") });
    appendScriptElement("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js", {id: "MathJax-script"}, function() { console.log("Included MathJax") 

    setInterval(function(){
	    //MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	    MathJax.startup.document.state(0);
            MathJax.texReset();
            MathJax.typeset();
	    console.log("test");
	}, 1000)
});
//    appendScriptElement(function(){
//        MathJax.typesetPromise().then(() => {
//            // modify the DOM here
//            MathJax.typesetPromise();
//        }).catch((err) => console.log(err.message));
//    }, {type: "text/x-mathjax-config"});
}

//        appendScriptElement('http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML', null, function(){
//            appendScriptElement(function(){
//                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//                if(!MutationObserver) {
//                    alert("MathJax plugin for TW5: Sorry, but current version of your browser is not supported!");
//                } else {
//                    var doMathJaxMagic = function(el){
//                        console.log('doing mathjax');
//                        MathJax.Hub.Queue(["Typeset", MathJax.Hub].concat(el || []));
//                    };
//                    var editObserver = new MutationObserver(function(mrecs,obs){
//                        mrecs.forEach(function(mrec){
//                            [].forEach.call(mrec.addedNodes,function(node){
//                                var className = node.className || '';
//                                if(/tw-reveal/.test(className) && !node.hidden || node.nodeType == Node.TEXT_NODE) {
//                                    var preview = node.parentNode.querySelector('.tw-tiddler-preview-preview');
//                                    if(preview) {
//                                        doMathJaxMagic(preview);
//                                    }
//                                }
//                            });
//                        });
//                    });
//                    var d = document.getElementsByClassName("story-river")[0];
//                    var viewObserver = new MutationObserver(function(mrecs,obs){
//                        mrecs.forEach(function(mrec){
//                            [].forEach.call(mrec.addedNodes, function(node){
//                                var className = node.className || '';
//                                if(/tw-tiddler-view-frame/.test(className)) {
//                                    console.log('new view frame');
//                                    doMathJaxMagic(node);
//                                } else if(/tw-tiddler-edit-frame/.test(className)) {
//                                    console.log('new edit frame - start observing');
//                                    var el = node.querySelector('.tw-keyboard');
//                                    editObserver.observe(el,{subtree:false,childList:true});
//                                }
//                            });
//                        });
//                    });
//                    viewObserver.observe(d,{subtree:false,childList:true});
//                }
//            });
//        });
//    };

    // End of plugin
})();

