"use-strict";

const __ = {
  /**
   * Check if user has dark mode as default
   * @returns {boolean}
   */
  prefersDarkMode: () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  /**
   * Get users text selection on e.g. mouseup
   * @returns {string}
   */
  getSelectedText: () => window.getSelection().toString() || "",
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
  average: (...args) => args.reduce((a, b) => a + b) / args.length,
  /**
   * Makes a json string from a uri querystring
   * @param {string} str key=value?.. string
   * @returns {string}
   */
  queryStringToJsonString: function (str) {
    let json;
    try {
      let KeyValue = str.includes("&") ? str.split("&") : str;
      json = "{";
      if (this.isNotEmptyArray(KeyValue)) {
        KeyValue.forEach((kv, idx) => {
          [k, v] = kv.split("=");
          json += `"${k}":"${v}"`;
          if (idx != KeyValue.length - 1) json += ",";
        });
      } else {
        [k, v] = KeyValue.split("=");
        json += `"${k}":"${v}"`;
      }
      json += "}";
      return json;
    } catch (err) {
      json = "{}";
      return json;
    }
  },
  /**
   * Takes url and returns query-string as json
   * @param {string} url (window.location)
   * @returns object
   */
  getUrlParamsAsJson: function (url = null) {
    if (!url) return;
    let json = null;
    let [host, params] = decodeURI(url).split("?");
    if (params) json = this.queryStringToJsonString(params);
    return JSON.parse(json) || JSON.parse("{}");
  },
  /**
   * Best guess browser detect, tested with ff 98.0 / Chrome 99.0.4844.51 / Safari 13.1.1 on macOs Catalina 0.15.5
   * @param {string} type decide the return type, default string
   * @returns string or object
   */
  browserDetect: (type = "string") => {
    let browser = null;
    const options = {
      firefox:
        typeof InstallTrigger !== "undefined" &&
        /Firefox/g.test(navigator.userAgent),
      safari:
        /Safari/g.test(navigator.userAgent) &&
        !/Chrome/g.test(navigator.userAgent),
      chrome:
        typeof window.chrome === "object" &&
        /Chrome/g.test(navigator.userAgent),
    };
    if (type === "object") {
      return options;
    } else {
      Object.keys(options).forEach((key) => {
        if (options[key] === true) browser = key;
      });
    }
    return browser;
  },
  /**
   * Builds autosuggest list, tweak how you want to pass the list.
   * Example is a string as data-list attribute (easy to concatenate from server-lang, no json string errors :) )
   * @param {search/text hrml elemetn input} element
   * @param {object} list
   * @param {string} objectSeparator
   * @param {string} paramSeparator
   * @param {string} target
   * @returns {void}
   */
  autoComplete: (
    element,
    list = null,
    objectSeparator = "###",
    paramSeparator = "|",
    target = "#myList"
  ) => {
    let resultsContainer =
      element.nextElementSibling || document.querySelector(target);
    let options;
    options = list ? list : element.dataset.list;

    // data passed as string
    if (typeof options === "string") {
      let s = options.split(objectSeparator);
      options = [];
      s.forEach((objString) => {
        let objArray = objString.split(paramSeparator);
        if (objArray[0] && objArray[1] && objArray[2]) {
          options.push({
            title: objArray[0],
            content: objArray[1],
            id: objArray[2],
            highLight: [],
          });
        }
      });
    }

    const injectHtml = (arr) => {
      resultsContainer.innerHtml = "";
      let title = document.createElement("div");
      title.classList.add("suggestion-title");
      arr.forEach((obj) => {
        obj.title.split(" ").forEach((word) => {
          let highlightClass = "unmarked";
          obj.highLight.forEach((h) => {
            if (word.toLowerCase().includes(h.toLowerCase())) {
              highlightClass = "mark";
            }
          });
          title.innerHTML += `<span class="${highlightClass}">${word}</span> `;
        });
      });
      resultsContainer.appendChild(title);
      console.log(arr);
    };

    element.addEventListener("keyup", (e) => {
      let hits = [];
      if (e.target.value.length < 2) {
        hits = [];
        return;
      }
      let terms = e.target.value.split(" ");
      options.forEach((item) => {
        let itemPushed = false;
        let termPushed = false;
        let noHits = 0;
        let noWords = 0;
        terms.forEach((term) => {
          if (term.length > 2) {
            // noWords = e.target.value.split(" ").length;
            if (item.title.includes(term) && !hits.includes(item)) {
              item.highLight.push(term);
              termPushed = true;
              itemPushed = true;
              noHits += 1;
              hits.push(item);
            }
            if (item.content.includes(term) && !hits.includes(item)) {
              noHits += 1;
              if (!itemPushed) {
                itemPushed = true;
                hits.push(item);
              }
              if (!termPushed) {
                item.highLight.push(term);
              }
            }
            if (noHits === 0) {
              item.highLight = [];
            }
          }
        });
      });

      injectHtml(hits);
    });

    // console.log(element.nextElementSibling);
    // console.log(element);
  },
};

// tests
// console.log(__.browserDetect());
// console.log(__.prefersDarkMode());
// window.addEventListener('mouseup', () => {
//   console.log(__.getSelectedText());
// });
// console.log( __.isNotEmptyArray([1,2]) );
// console.log(__.average(5,8,9));
// console.log(__.getUrlParamsAsJson(window.location));
if (document.querySelectorAll('[data-module="autocomplete"]')) {
  document.querySelectorAll('[data-module="autocomplete"]').forEach((input) => {
    __.autoComplete(input);
  });
}
