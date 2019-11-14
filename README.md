# utf-info (Unicode Character Information)
Get encoding information of a character in UTF-8, UTF-16 and UTF-32 encodings.

[![npm-version](https://img.shields.io/npm/v/utf-info?style=flat-square)](https://www.npmjs.com/package/utf-info)
[![dependencies](https://img.shields.io/david/thatisuday/utf-info?style=flat-square)](https://www.npmjs.com/package/utf-info)
[![downloads](https://img.shields.io/npm/dt/utf-info?style=flat-square)](https://www.npmjs.com/package/utf-info)
[![license](https://img.shields.io/npm/l/utf-info?style=flat-square)](https://www.npmjs.com/package/utf-info)

## Install
```js
npm install -S utf-info
```

## Use
```js
const utfInfo = require( 'utf-info' );

// syntax:
utfInfo( character, encoding );
// character => single Unicode character (string)
// encoding => valid UTF encoding (string) viz. utf-8, utf-16, and utf-32

// examples:
const result = utfInfo( '😊' ); // character `😊`
// const result = utfInfo( '\x41', 'utf-8' ); // '\x41' is ASCII escape character `A`
// const result = utfInfo( '\u0906', 'utf-16' ); // '\u0906' is Unicode escape for character `आ`

/**************
result => {
    character: '😊',
    codePoint: {
        dec: 128522,
        hex: '01F60A',
        bits: 20
    },
    codeUnits: {
        count: '2',
        dec: [55357, 56842],
        binary: ['1101100000111101', '1101111000001010'],
        hex: ['D83D', 'DE0A'],
        escape: { ascii: null, unicode: '\\uD83D\\uDE0A' }
    }
}
**************/
```


## Run test
```
cd /repo/utf-info/
npm run test

fn:utfInfo suit
    ✓ should return 0041 code point for the character A
    ✓ should return 0906 code point for the character आ
    ✓ should return `["D83D", "DE0A"]` UTF-16 code units for the character 😊
```