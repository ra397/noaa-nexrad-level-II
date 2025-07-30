if (!String.prototype.format) {
    String.prototype.format = function() {
        const args = arguments;
        let _ret;
        return this.replace(
            /{(\d+)}/g,
            function(match, number) {
                _ret  = typeof args[number] != 'undefined' ? args[number] : match;
                return _ret != null ? _ret : '';
            }
        )
    }
}

// !!! DON"T FO IT !!!! for (e in array) !!!
// if (!Array.prototype.last){
//     Array.prototype.last = function(){
//         return this[this.length - 1];
//     };
// };

if (!String.prototype.allReplace) {
    String.prototype.allReplace = function(obj) {
        var retStr = this;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        }
        return retStr;
    };
}


if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
    };
}

if (!String.prototype.toTitleCase) {
    String.prototype.toTitleCase = function () {
        _temp = this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        _temp.allReplace({" At ": " at ", "Near": "near"});
        return _temp;
    }
}

if (!Number.prototype.toRad) {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

if (!Number.prototype.toDeg) {
    Number.prototype.toDeg = function() {
        return this * 180 / Math.PI;
    }
}



const dtStrUxt = (dt_str) => {
    dt = new Date(dt_str);
    return dt.getTime() / 1000
};
const _isNull = (v) => typeof v === "object" && !v;
const _isNumeric = (s) =>  typeof s != "string" ? false : !isNaN(str) && !isNaN(parseFloat(str));

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function getStream (_url){
    const source = await fetch(_url);
    return await source.text();
}

async function getArrayBuffer (_url){
    const source = await fetch(_url);
    return await source.arrayBuffer();
}

async function getJson(_url){
    const source = await fetch(_url);
    return await source.json();
}

const getJSON = getJson;

function zeroPadded (num){
    return ('' + num).padStart(2, '0');
}

function jsonElem(obj){
    const svgNS = "http://www.w3.org/2000/svg";
    var el;
    if (obj.tagName.toUpperCase() == 'LINE' || obj.tagName.toUpperCase() == 'SVG') {
        el = document.createElementNS(svgNS, obj.tagName);
        Object.entries(obj.attributes).forEach(a => el.setAttributeNS(null, a[0], a[1]));
    }
    else {
        el = document.createElement(obj.tagName);
        if (obj.hasOwnProperty('attributes'))
            Object.entries(obj.attributes).forEach(a => el.setAttribute(a[0], a[1]));
    }
    if (obj.hasOwnProperty('textContent'))
        el.textContent = obj.textContent;

    if (obj.hasOwnProperty('children'))
        for (var i = 0; i < obj.children.length; i++) el.append(jsonElem(obj.children[i]))

    return el;
}

function elemJson(el, obj){
    if(!obj){obj=[]}
    var tag = {}
    tag['tagName']=el.tagName
    tag['children'] = []
    tag['attributes'] = {}
    console.log(el)
    if (el.childNodes.length == 1 && el.childNodes[0].nodeType == Node.TEXT_NODE) tag.textContent = el.childNodes[0].textContent;
    for(var i = 0; i < el.children.length;i++){
        tag['children'].push(elemJson(el.children[i]))
    }

    for(var i = 0; i < el.attributes.length;i++){
        var attr= el.attributes[i]
        tag['attributes'][attr.name] =  attr.value;
    }
    return tag
}

function ifExist(_url) {
    const _head = 'HEAD';
    let _http;
    if (window.XMLHttpRequest) {
        _http = new XMLHttpRequest();
    } else {
        _http = new ActiveXObject("Microsoft.XMLHTTP");
    }
    _http.open(_head, _url, true);
    try {
        _http.send();
    } catch (e) {
        return 0;
    }
    return parseInt(_http.status) !== 404;
}

function ResizeSensor(element, callback){
    const onScroll = ()=> {
        let size = element.getBoundingClientRect();

        let newWidth = size.width;
        let newHeight = size.height;

        if(newWidth != currentWidth || newHeight != currentHeight)
        {
            currentWidth = newWidth;
            currentHeight = newHeight;

            callback();
        }

        setScroll();
    };
    const setScroll = () => {
        expand.scrollLeft = 10000000;
        expand.scrollTop = 10000000;

        shrink.scrollLeft = 10000000;
        shrink.scrollTop = 10000000;
    };
    let zIndex = parseInt(getComputedStyle(element))-1 || 0;

    let expand = document.createElement('div');
    let shrink = Object.assign(...expand);
    expand.style = {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: zIndex,
        visibility: "hidden"
    };

    let expandChild = document.createElement('div');
    expandChild.style = {
        position: "absolute",
        left: "0px",
        top: "0px",
        width: "10000000px",
        height: "10000000px"
    };
    expand.appendChild(expandChild);
    let shrinkChild = document.createElement('div');
    shrinkChild.style= {
        position:  "absolute",
        left:  "0px",
        top:  "0px",
        width:  "200%",
        height:  "200%"
    };
    shrink.appendChild(shrinkChild);

    element.appendChild(expand);
    element.appendChild(shrink);


    setScroll();

    let size = element.getBoundingClientRect();

    let currentWidth = size.width;
    let currentHeight = size.height;

    expand.addEventListener('scroll', onScroll);
    shrink.addEventListener('scroll', onScroll);
}

const toggle_elem = (e) => {
    if (e) {
        if (e.classList.contains(HIDDEN)) e.classList.remove(HIDDEN)
        else e.classList.add(HIDDEN)
    }
};


function _GET(){
    const query = window.location.search.substring(1).split("&");
    let args ={}, param;
    for (let i = 0,
             max = query.length;
         i < max; i++
    ) {
        if (query[i] === "") continue;
        param = query[i].split("=");
        args[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
    }
    return args
}

function _sortByKey(array, key) {
    let x,
        y;
    return array.sort(
        function(a, b) {
            x = a[key];
            y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    );
}

const hex2rgb = (hex, as_str=1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // return {r, g, b}
    if (as_str)
        return `${r}, ${g}, ${b}`;
    else
        return {r, g, b};
}

function _ordinalSuffix(i) {
    let j = i % 10,
        k = i % 100,
        s = "th";
    if (j === 1 && k !== 11)  s = "st";
    else if (j === 2 && k !== 12)  s = "nd";
    else if (j === 3 && k !== 13)  s = "rd";
    return  i+s;
}

function makeRequest (req_method, url, _pass=0) {
    return new Promise(
        function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open(req_method, url, true);
            xhr.responseType = 'arraybuffer';
            xhr.send();
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve([xhr.response, _pass]);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
        }
    );
}

function project(latLng, tile_size=256) {
    let sinY = Math.sin((latLng.lat()* Math.PI) / 180);
    sinY = Math.min(Math.max(sinY, -0.9999), 0.9999);

    return new google.maps.Point(
        tile_size * (0.5 + latLng.lng() / 360),
        tile_size * (0.5 - Math.log((1 + sinY) / (1 - sinY)) / (4 * Math.PI))
    );
}

function decodeGeoJson(obj){
    let _use;
    for (var k in obj) {
        //console.log(k)
        if (typeof obj[k] == "object" && obj[k] !== null && k != 'coordinates') {
            decodeGeoJson(obj[k]);
        } else if (k == 'coordinates') {
            if (obj[k].length > 0){
                for (i=0; i < obj[k].length; i++) {
                    obj[k][i] = google.maps.geometry.encoding.decodePath(obj[k][i]).map(
                        (latLng) => {
                            return [latLng.lat(),latLng.lng()];
                        }
                    );
                }
            } else {
                obj[k] = google.maps.geometry.encoding.decodePath(obj[k]).map(
                    (latLng) => {
                        return [latLng.lat(),latLng.lng()];
                    }
                );
            }
        }
    }
}

function extend(fn,code){
    return function(){
        fn.apply(fn,arguments);
        code.apply(fn,argumnets)
    }
}

async function addHTML(url, el) {
    const resp = await fetch(url);
    const html = await resp.text();
    return el.insertAdjacentHTML("beforeend", html);
}

var getAbsoluteUrl = (function() {
    let a;
    return function(url) {
        if(!a) a = document.createElement('a');
        a.href = url;
        return a.href;
    };
})();