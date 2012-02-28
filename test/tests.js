
module("stwt.txt");

test("extractCashtags", function() {
  var tests = [
    ["$FOO", "FOO"],
    ["$FOO$BAR", ""],
    ["$FOO $BAR", "FOO,BAR"],
    ["$$FOO", "FOO"],
    ["$FOO.A $FOO-B", "FOO.A,FOO-B"],
    ["$FOO,$BAR,,$BAZ", "FOO,BAR,BAZ"],
    ["$6B $6M $25M $5k", ""],
    ["$2.55 $33 $95.00", ""],
    ["$3million $5billion $12trillion", ""],
    ["$ES_F $6C_F", "ES_F,6C_F"],
    ["$A.B.C", "A.B.C"],
    ["$A.B.C.D", "A.B.C"],
    ["$A.B.C..$D", "A.B.C,D"],
    [" $FOO ", "FOO"],
    ["@#^$!@#$FOO", ""],
    ["FU$$Y", ""],
    [" $FOO..$BAR,$FOO", "FOO,BAR,FOO"],
    ["$$FOO$$BAR $$BAZ", "BAZ"],
    ["$ES_F, -$FOO+$BAR", "ES_F,FOO,BAR"],
    ["$LONGLONG", "LONGLONG"],
    ["($FOO)($BAR)", "FOO,BAR"],
    ["+$FOO-$BAR", "FOO,BAR"]
  ];

  for(var i=0; i<tests.length; i++) {
    equal(stwt.txt.extractCashtags(tests[i][0]), tests[i][1], tests[i][0] + " -> " + tests[i][1]);
  }
});


test("autoLinkCashtags (no options)", function() {
  var tests = [
    ["hello $FOO", "hello <a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>"],
    ["hello $FOO,$BAR", "hello <a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>,<a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/BAR\">$BAR</a>"],
    ["$$FOO$$BAR..$BAZ", "$$FOO$$BAR..<a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/BAZ\">$BAZ</a>"],
    ["-$FOO+$BAR", "-<a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>+<a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/BAR\">$BAR</a>"]
  ]

  for(var i=0; i<tests.length; i++) {
    equal(stwt.txt.autoLinkCashtags(tests[i][0]), tests[i][1], tests[i][0] + " -> " + tests[i][1]);
  }
});

test("autoLinkCashtags (options)", function() {
  var tests = [
    [["test $FOO", { urlClass: null }], 
      "test <a href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlClass: null }"],
    [["test $FOO", { urlClass: "" }],
      "test <a href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlClass: \"\" }"],
    [["test $FOO", { urlClass: undefined }], 
      "test <a class=\"stwt-url cashtag\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlClass: undefined }"],
    [["test $FOO", { urlClass: false }], 
      "test <a href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlClass: false }"],
    [["test $FOO", { urlClass: "testa testb" }], 
      "test <a class=\"testa testb\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlClass: \"testa testb\" }"],
    [["test $FOO", { urlTarget: "_new" }], 
      "test <a class=\"stwt-url cashtag\" target=\"_new\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlTarget: \"_new\" }"],
    [["test $FOO", { urlNofollow: true }], 
      "test <a class=\"stwt-url cashtag\" rel=\"nofollow\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlNofollow: true }"],
    [["test $FOO", { urlClass: "foo", urlNofollow: true, urlTarget: "_new" }], 
      "test <a class=\"foo\" target=\"_new\" rel=\"nofollow\" href=\"http://stocktwits.com/symbol/FOO\">$FOO</a>", 
      "test $FOO { urlClass: \"foo\", urlNofollow: true, urlTarget: \"_new\" }"],
    [["test $FOO", { url: "http://example.com?q=%s&foo=1" }], 
      "test <a class=\"stwt-url cashtag\" href=\"http://example.com?q=FOO&foo=1\">$FOO</a>", 
      "test $FOO { url: \"http://example.com?q=%s&foo=1\" }"]
  ];

  for(var i=0; i<tests.length; i++) {
    equal(stwt.txt.autoLinkCashtags(tests[i][0][0], tests[i][0][1]), tests[i][1], tests[i][2] + " -> " + tests[i][1]);
  }
});

test("autoLinkCashtags (callback)", function() {
  var tests = [
    [["test $FOO", function(cashtag, symbol) { return "http://example.com/symbol/" + symbol + " " + cashtag; }], 
      "test http://example.com/symbol/FOO $FOO"],
    [["test $FOO,$BAR", function(cashtag, symbol) { return "<a href='http://example.com/symbol/" + symbol + "'>" + cashtag + "</a>"; }], 
      "test <a href='http://example.com/symbol/FOO'>$FOO</a>,<a href='http://example.com/symbol/BAR'>$BAR</a>"],
  ];

  for(var i=0; i<tests.length; i++) {
    equal(stwt.txt.autoLinkCashtags(tests[i][0][0], tests[i][0][1]), tests[i][1]);
  }
});