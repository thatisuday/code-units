# code-units
Get encoding information of a character in UTF-8, UTF-16 and UTF-32 encodings.

## Install
```js
npm install -S utf-info
```

## Use
```js
const utfInfo = require( 'utf-info' );

const result = utfInfo( '😊' ); // character `😊`
// const result = utfInfo( '\u0906' ); // '\u0906' is Unicode escape for character `आ`
// const result = utfInfo( '\x41' ); // '\x41' is ASCII escape character `A`

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