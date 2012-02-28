# stocktwits-text-js

A Javascript library that provides text processing routines for StockTwits Messages. This library provides autolinking and extraction for cashtags (e.g. $GOOG).

## Cashtag Examples

### Extraction

    stwt.txt.extractCashtags("$FOO $BAR")
    → ['FOO', 'BAR']

### Autolinking

    // Default
    stwt.txt.autoLinkCashtags("$FOO")
    → '<a class="stwt-url cashtag" href="http://stocktwits.com/symbol/FOO">$FOO</a>'

    // Options
    stwt.txt.autoLinkCashtags("$FOO", { urlClass: 'foo bar', urlTarget: '_blank', urlNofollow: true });
    → '<a class="foo bar" target="_blank" rel="nofollow" href="http://stocktwits.com/symbol/FOO">$FOO</a>'

    // URL interpolation
    stwt.txt.autoLinkCashtags("$FOO", { url: "http://example.com/?q=%s&c=1" })
    → '<a class="stwt-url cashtag" href="http://example.com/?q=FOO&c=1">$FOO</a>'

    // Callback
    stwt.txt.autoLinkCashtags("$FOO", function(cashtag, symbol) {
      return "<a href=\"/symbol/" + symbol + "\">" + cashtag + "</a>"
    });
    → '<a href="/symbol/FOO">$FOO</a>'

### Using with jQuery

    var contentHtml = $('#content').html();
    $('#content').html(stwt.txt.autoLinkCashtags(contentHtml));

## Credits

This library is modeled after Twitter's excellent text processing libraries.

## Reporting Bugs

Please direct bug reports to the [stocktwits-text-js issue tracker on GitHub](http://github.com/stocktwits/stocktwits-text-js/issues)

## Copyright and License

Copyright 2012 StockTwits, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
