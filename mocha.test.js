const { assert } = require( 'chai' );

// import decoder function
const utfInfo = require( '.' );

/******************************************************
utfInfo('😊') => {
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
******************************************************/

describe( 'fn:utfInfo suit', () => {

    // test 1: character `A` (CP: 0x41)
    it( 'should return 0041 code point for the character A', () => {
        const result = utfInfo( 'A' );
        assert.equal( result.codePoint.hex, '0041' );
    } );

    // test 2: character `आ` (CP: 0x906)
    it( 'should return 0906 code point for the character आ', () => {
        const result = utfInfo( 'आआ' ); // substring test (takes only first character)
        assert.equal( result.codePoint.hex, '0906' );
    } );

    // test 3: character `😊` (CP: 0x1F60A)
    it( 'should return `["D83D", "DE0A"]` UTF-16 code units for the character 😊', () => {
        const result = utfInfo( `\u{1F60A}`, 'utf-16' ); // ES6 Unicode escape
        assert.equal( result.codeUnits.hex.join( ',' ), ["D83D", "DE0A"].join( ',' ) );
    } );
} );