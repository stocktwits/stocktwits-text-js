stwt = window.stwt || {};

(function() {
  stwt.txt = {};
  stwt.txt.regexen = {};
  stwt.txt.regexen.cashtag = /(^|[\s\,\.\-\+\(\/\"\']\$?|^\$)(\$([a-z1-9]{1}[a-z]{1,3}_F|(?!\d+[bmkts]{1}?(il(lion)?|ln|m|n)?\b|[\d]+\b)(?!\d+usd)[a-z0-9]{1,9}(?:[-\.]{1}[a-z]{1,2})?(?:[-\.]{1}[a-z]{1,2})?))\b(?!\$)/ig;

  stwt.txt.extractCashtags = function(text) {
    var matches = [];

    text.replace(stwt.txt.regexen.cashtag, function(match, prefix, cashtag) {
      matches.push(cashtag.slice(1));
    });

    return matches;
  }

  stwt.txt.autoLinkCashtags = function(text, options) {
    if (typeof(options) === "function") {
      return text.replace(stwt.txt.regexen.cashtag, function(match, before, cashtag) {
        return before + options.call(this, cashtag.toUpperCase(), cashtag.toUpperCase().slice(1));
      });
    }

    var html = [];
    var opts = options || {};
    var htmlAttributes = {}
    for (var k in options) {
      if (k !== "urlClass" && k !== "urlTarget" && k !== "urlNofollow" && k !== "url") {
        htmlAttributes[k] = options[k];
      }
    }

    var classes = [];
    if (htmlAttributes['class']) {
      classes.push(htmlAttributes['class']);
    }
    if (opts.urlClass === undefined) {
      classes.push("stwt-url cashtag");
    } else if (opts.urlClass) {
      classes.push(opts.urlClass);
    }
    htmlAttributes['class'] = classes.join(" ");

    if (opts.urlTarget) {
      htmlAttributes.target = opts.urlTarget;
    }
    if (opts.urlNofollow) {
      htmlAttributes.rel = "nofollow";
    }

    opts.url = opts.url || "http://stocktwits.com/symbol/%s";
    htmlAttributes.href = opts.url

    return text.replace(stwt.txt.regexen.cashtag, function(match, before, cashtag) {
      cashtag = cashtag.toUpperCase();
      var html = "";
      var v;
      for (k in htmlAttributes) {
        if (v = htmlAttributes[k]) {
          html += " " + k + "=\"" + v.replace('%s', cashtag.slice(1)) + "\"";
        }
      }
      return before + "<a" + html + ">" + cashtag + "</a>";
    });
  }
})();
