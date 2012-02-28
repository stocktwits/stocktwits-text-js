stwt = window.stwt || {};

(function() {
  stwt.txt = {};
  stwt.txt.regexen = {};
  stwt.txt.regexen.cashtag = /(^|[\s\,\.\-\+\(]\$?|^\$)(\$([a-z1-9]{1}[a-z]{1,3}_F|(?!\d+[bmkts]{1}?(il(lion)?)?\b|[\d]+\b)[a-z0-9]{1,9}(?:[-\.]{1}[a-z]{1,2})?(?:[-\.]{1}[a-z]{1,2})?))\b(?!\$)/ig;

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

    opts.urlClass     = (opts.urlClass === undefined) ? "stwt-url cashtag" : opts.urlClass;
    opts.urlTarget    = opts.urlTarget || null;
    opts.urlNofollow  = opts.urlNofollow ? true : false;
    opts.url          = opts.url || "http://stocktwits.com/symbol/%s";

    if (opts.urlClass)    { html.push("class=\"" + opts.urlClass + "\""); }
    if (opts.urlTarget)   { html.push("target=\"" + opts.urlTarget + "\""); }
    if (opts.urlNofollow) { html.push("rel=\"nofollow\""); }

    html = (html.length > 0) ? (" " + html.join(" ") + " ") : " ";

    return text.replace(stwt.txt.regexen.cashtag, function(match, before, cashtag) {
      cashtag = cashtag.toUpperCase();
      return before + "<a" + html + "href=\"" + opts.url.replace('%s', cashtag.slice(1)) + "\">" + cashtag + "</a>";
    });
  }
})();