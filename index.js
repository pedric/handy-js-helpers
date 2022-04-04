'use-strict';

const __ = {
  /**
   * Check if user has dark mode as default
   * @returns {boolean}
   */
  prefersDarkMode: () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  /**
   * Get users text selection on e.g. mouseup
   * @returns {string}
   */
  getSelectedText: () => window.getSelection().toString() || '',
  /**
   * Checks if variable is a non empty array
   * @param {array} arr 
   * @returns {boolean}
   */
  isNotEmptyArray: (arr) => Array.isArray(arr) && arr.length > 0,
  /**
   * Calculates the average of a set of numbers
   * @param  {...number} args 
   * @returns {number}
   */
  average: (...args) => args.reduce((a,b) => a+b) / args.length,
  /**
   * Makes a json string from a uri querystring
   * @param {string} str key=value?.. string
   * @returns {string}
   */
  queryStringToJsonString: function(str) {
    let json;
    try{
      let KeyValue = str.includes('&') ? str.split('&') : str;
      json = '{';
      if(this.isNotEmptyArray(KeyValue)) {
        KeyValue.forEach((kv, idx) => {
          [k,v] = kv.split('=');
          json += `"${k}":"${v}"`;
          if (idx != KeyValue.length-1) json += ',';
        })
      } else {
        [k,v] = KeyValue.split('=');
        json += `"${k}":"${v}"`;
      }
      json += '}';
      return json;
    }
    catch(err) {
      json = '{}';
      return json;
    }
  },
  /**
   * Takes url and returns query-string as json
   * @param {string} url (window.location) 
   * @returns object
   */
  getUrlParamsAsJson: function(url = null) {
    if(!url) return;
    let json = null;
    let [host,params] = decodeURI(url).split('?');
    if(params) json = this.queryStringToJsonString(params);
    return JSON.parse(json) || JSON.parse('{}');
  },
  /**
   * Best guess browser detect, tested with ff 98.0 / Chrome 99.0.4844.51 / Safari 13.1.1 on macOs Catalina 0.15.5
   * @param {string} type decide the return type, default string
   * @returns string or object
   */
  browserDetect: (type = 'string') => {
    let browser = null;
    const options = {
      firefox: typeof InstallTrigger !== 'undefined' && /Firefox/g.test(navigator.userAgent),
      safari: /Safari/g.test(navigator.userAgent) && !/Chrome/g.test(navigator.userAgent),
      chrome: typeof window.chrome === 'object' && /Chrome/g.test(navigator.userAgent),
    }
    if(type === 'object'){
      return options;
    } else {
      Object.keys(options).forEach((key)=> {if(options[key] === true) browser = key});
    }
    return browser;
  }
}

// tests
console.log(__.browserDetect());
console.log(__.prefersDarkMode());
window.addEventListener('mouseup', () => {
  console.log(__.getSelectedText());
}); 
console.log( __.isNotEmptyArray([1,2]) );
console.log(__.average(5,8,9));
console.log(__.getUrlParamsAsJson(window.location));

// export default __;