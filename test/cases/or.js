/*global regex,test,strictEqual,module*/

module('or() cases');

test('basic usage', function () {
    'use strict';

    var result;

    result = regex()
        .or()
            .literals('abc')
            .call(function (rb) {
                strictEqual(rb.peek(), 'abc');
            })
            .literals('def')
            .call(function (rb) {
                strictEqual(rb.peek(), 'abc|def');
            })
        .endOr()
        .peek();

    strictEqual(result, 'abc|def');

});

test('literals before and after', function () {
    'use strict';

    var result;

    result = regex()
        .literal('a')
        .or()
            .literal('b')
            .literal('c')
        .endOr()
        .peek();

    strictEqual(result, 'a(?:b|c)', 'before');

    result = regex()
        .or()
            .literal('b')
            .literal('c')
        .endOr()
        .literal('d')
        .peek();

    strictEqual(result, '(?:b|c)d', 'after');

    result = regex()
        .literal('a')
        .or()
            .literal('b')
            .literal('c')
        .endOr()
        .literal('d')
        .peek();

    strictEqual(result, 'a(?:b|c)d', 'both before and after');

});

test('literals before and after, but no wrap needed', function () {
    'use strict';

    var result;

    result = regex()
        .literal('a')
        .or()
            .literal('b')
        .endOr()
        .peek();

    strictEqual(result, 'ab', 'lit before');

    result = regex()
        .or()
            .literal('b')
        .endOr()
        .literal('c')
        .peek();

    strictEqual(result, 'bc', 'lit after');

    result = regex()
        .literal('a')
        .or()
            .literal('b')
        .endOr()
        .literal('c')
        .peek();

    strictEqual(result, 'abc', 'lit before and after');
});

test('capturing or()', function () {
    'use strict';

    var result;

    result = regex()
        .literals('a')
        .or()
            .literals('bc')
        .endOr()
        .capture()
        .peek();

    strictEqual(result, 'a(bc)', 'No non-capturing group necessary');

    result = regex()
        .literals('a')
        .or()
            .literals('bc')
            .literals('jk')
        .endOr()
        .capture()
        .peek();

    strictEqual(result, 'a(bc|jk)', 'No non-capturing group necessary');
});

test('or() with single or term reports as such', function () {
    'use strict';
    regex()
        .or()
            .or()
                .literals('a')
                .literals('b')
            .end()
            .call(function (rb) {
                strictEqual(rb.peek(), 'a|b');
            })
        .end()
        .call(function (rb) {
            strictEqual(rb.peek(), 'a|b');
        })
        .literals('c')
        .call(function (rb) {
            strictEqual(rb.peek(), '(?:a|b)c');
        });
});

test('recursively entering ors doesnt behave oddly', function () {
    'use strict';
    regex()
        .or()
            .literals('a')
            .or()
                .literals('a')
                .literals('b')
                .call(function (rb) {
                    strictEqual(rb.peek(), 'a|b');
                })
            .end()
            .call(function (rb) {
                strictEqual(rb.peek(), 'a|(?:a|b)');
            })
        .end()
        .call(function (rb) {
            strictEqual(rb.peek(), 'a|(?:a|b)');
        })
        .literals('a')
        .call(function (rb) {
            strictEqual(rb.peek(), '(?:a|(?:a|b))a');
        });
});

test('calling or without doing anything is basically ignored', function () {
    'use strict';
    regex()
        .or().call(function () {}).end()
        .literals('a')
        .call(function (rb) {
            strictEqual(rb.peek(), 'a');
        });
});
