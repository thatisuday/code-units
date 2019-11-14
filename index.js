const char1 = 'A';
const char2 = 'आ';
const char3 = '😊';
// const char = '😊';
//const charExp = `\u{1F60A}`;

const { getEncodingData } = require('./src/utils' );

// console.log( codeUnitsCount( charExp ), bitsForCodeUnit( charExp ) );
// console.log( codeUnitsCount( charExp, 'utf-16' ), bitsForCodeUnit( charExp, 'utf-16' ) );
// console.log( codeUnitsCount( charExp, 'utf-32' ), bitsForCodeUnit( charExp, 'utf-32' ) );

console.log( getEncodingData( char1, 'utf-16' ) );