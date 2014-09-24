;(function(){
    NodeList.prototype.forEach = Array.prototype.forEach; 
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    
    document.write = function(s){
        /*
        postscribe(document.currentScript.parentElement, s, {
            done: function(){
                console.log("Done: " + s);
            }
        });*/
        //console.log(s);
        var fragment = document.createElement('div'); 
        fragment.innerHTML = s;
        fragment.childNodes.forEach(function(element, index){
            if(element.nodeType == 1) {
                var scriptEl = document.createElement(element.tagName);            
                document.currentScript.parentElement.insertBefore(scriptEl, document.currentScript);
                if (element.src) {
                    console.log("element src: " + element.src);                
                    scriptEl.src = element.src;
                } else {
                    console.log("element innerHTML: " + element.innerHTML);
                    scriptEl.innerHTML = element.innerHTML;
                }
            } else {
                console.log("not an element: " + element);
            }
        });
        
    }
    
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {            
            var scripts = document.querySelectorAll("script[data-src]");
            scripts.forEach(function(element, index){
                element.src = element.getAttribute("data-src");
            });
            var scripts = document.querySelectorAll("code");
            scripts.forEach(function(element, index){
                if(element.childNodes[0]) {
                var script = element.childNodes[0].textContent;
                if(script != "") {
                    try {
                        var scriptEl = document.createElement("script"); 
                        scriptEl.innerHTML = script;
                        var wrapperEl = document.createElement("div");
                        element.parentElement.insertBefore(wrapperEl, element);
                        //console.log(script);
                        wrapperEl.appendChild(scriptEl);
                        //console.log(document.body);
                   // console.log(element.parentNode);
                    //element.parentNode.insertBefore(scriptEl, element);
                    //document.body.appendChild(scriptEl);
                    } catch (err) {
                        console.log(err);
                    }
                }
                }
            });
        }
    }
}());