const _ = require( 'lodash' );

// local dependencies
const { codeUnitsPerEncodingPerRange, bitsUsedPerEncodingPerCodeUnitsCount, codeUnitLengthPerEncoding, codeUnitsTemplatePerEncoding } = require( './mapping' );

// pad binary or hex number (string) with `0` (from left)
const padLeftZeros = ( hexBinStr, _finalLength ) => {

    // set minimum length of the binary number
    const finalLength =  _.isNil( _finalLength ) ? hexBinStr.length : _finalLength;

    // create binary number string with `finalLength` zeros added to the left
    const binaryWithZeros = `${ Array( finalLength ).fill( '0' ).join( '' ) }${ hexBinStr }`;

    // return substring of the `safeBinary` which is equal to `finalLength in length (from the end)
    return binaryWithZeros.substr( -( finalLength ) );
};

// get binary number from decimal integer value
const decToBinary = ( decValue, finalLength ) => {

    // get binary string value
    const binaryStr = Number( decValue ).toString( 2 ); // Radix = 2 for binary

    // return 0 padded binary number (string)
    return padLeftZeros( binaryStr, finalLength );

};

// code units to decimal numbers
const codeUnitsToDec = ( codeUnits ) => {
    return codeUnits.map( codeUnit => {
        return parseInt( codeUnit, 2 );
    } );
};

// code units to hex numbers
const codeUnitsToHex = ( codeUnits ) => {
    return codeUnits.map( codeUnit => {

        // get hexadecimal representation
        const hexNumber = Number( parseInt( codeUnit, 2 ) ).toString( 16 ).toUpperCase();

        // pad hexadecimal number with zero
        return padLeftZeros( hexNumber, ( codeUnit.length / 4 ) ); // 4 bits = 1 hex character
    } );
};

// code units to ASCII escape
const codeUnitsToAsciiEscape = ( character ) => {
    
    // get UTF-8 code units
    const { codeUnits } = getEncodingData( character, 'utf-8' );

    // returned escape sequence 
    return codeUnitsToHex( codeUnits ).map( codeUnitHex => {

        // ASCII escape is represented in UTF-8 : '\x<code-unit>'
        return '\x5Cx' + codeUnitHex;
    } ).join( '' );
};

// code units to Unicode escape
const codeUnitsToUnicodeEscape = ( character ) => {

    // get UTF-16 code units
    const { codeUnits } = getEncodingData( character, 'utf-16' );

    // returned escape sequence 
    return codeUnitsToHex( codeUnits ).map( codeUnitHex => {

        // unicode escape is represented in UTF-16 : '\u<code-unit>' or '\u<high-surrogate>\u<low-surrogate>'
        return '\x5Cu' + codeUnitHex;
    } ).join( '' );
};

/************************************************/

// get code point of a character
const getCodePoint = ( character ) => {
    return String( character ).codePointAt( 0 ); // ES6 method
};

// get actual coded value of bits used for encoding
const getEncodeValue = ( charCodePoint, charCodeUnitsCount, encoding ) => {
    switch( encoding ) {
        case 'utf-8': {
            return charCodePoint;
        }

        // only in case of UTF-16, characters represented by 2 code units has offset of 0xFFFF
        case 'utf-16': {
            return ( encoding === 'utf-16' && parseInt( charCodeUnitsCount ) === 2 ) ? charCodePoint - 0x10000 : charCodePoint;
        }

        case 'utf-32': {
            return charCodePoint;
        }
    }
};

// get number of code units for given character and encoding
const codeUnitsCount = ( character, encoding = 'utf-8' ) => {

    // get map of code units (count) and code point range
    const codeUnitsPerRange = codeUnitsPerEncodingPerRange[ encoding ];

    // get code point of the `character`
    const charCodePoint = getCodePoint( character );

    // find key (code point count) when `codePoint` is in `range`
    return _.findKey( codeUnitsPerRange, ( [ min, max ] ) => {
        return _.inRange( charCodePoint, min, ( max + 1 ) ); // `max + 1` since `inRange` does not consider the last value
    } );
};


// get bits used for encoding for a character
const bitsForCodePoint = ( character, encoding = 'utf-8' ) => {

    // get map of code units (count) and code point range
    const bitsUsedPerCodeUnitsCount = bitsUsedPerEncodingPerCodeUnitsCount[ encoding ];

    // get number of code units used
    const charCodeUnitsCount = codeUnitsCount( character, encoding );

    // return bits used
    return bitsUsedPerCodeUnitsCount[ charCodeUnitsCount ];
};


// get encoding information of the character
const getEncodingData = ( character, encoding = 'utf-8' ) => {

    // get code units (count) used for the `character`
    const charCodeUnitsCount = codeUnitsCount( character, encoding );

    // get actual bits used to encode the code point
    const charBitsForCodePoint = bitsForCodePoint( character, encoding );

    // get code point of the character
    const charCodePoint = getCodePoint( character );

    // code point to hex (4 or 6 digits long)
    const _charCodePointHex = Number( charCodePoint ).toString( 16 ).toUpperCase();
    const charCodePointHex = padLeftZeros( _charCodePointHex, ( _charCodePointHex.length > 4 ) ? 6 : 4 );

    // get actual value of the bits used for encoding
    const encodeValue = getEncodeValue( charCodePoint, charCodeUnitsCount, encoding );

    // get binary representation of the code point with exact length equal to `charBitsForCodePoint`
    const charCodePointBinary = decToBinary( encodeValue, charBitsForCodePoint );

    // get code units template for given encoding and code units count
    const charCodeUnitsTemplate = _.cloneDeep( codeUnitsTemplatePerEncoding[ encoding ][ charCodeUnitsCount ] );

    // maintain offset to read bits from `charCodePointBinary`
    let _readOffset = 0;

    // create an array of code units
    const codeUnits = _.map( charCodeUnitsTemplate, ( codeUnitTemplate ) => {

        // count number of `x` in the code unit template
        const xCount = ( codeUnitTemplate.match( /x/g ) || [] ).length;

        // replace all `x` in the code unit template with same length binary numer portion of `charCodePointBinary`
        const codeUnit = codeUnitTemplate.replace( /x+/, charCodePointBinary.substr( _readOffset, xCount ) );

        // move read offset
        _readOffset += xCount;

        // return code unit
        return codeUnit;
    } );

    // 
    return {
        charCodePoint,
        charCodePointHex,
        charCodeUnitsCount,
        charBitsForCodePoint,
        codeUnits
    };
};


// return encoding information of the character
exports.getEncodingData = ( character, encoding = 'utf-8' ) => {
    const {
        charCodePoint,
        charCodePointHex,
        charCodeUnitsCount,
        charBitsForCodePoint,
        codeUnits
    } = getEncodingData( character, encoding );

    // return character information
    return  {
        character: String.fromCodePoint( charCodePoint ),
        codePoint: {
            dec: charCodePoint,
            hex: charCodePointHex,
            bits: charBitsForCodePoint
        },
        codeUnits: {
            count: charCodeUnitsCount,
            dec: codeUnitsToDec( codeUnits ),
            binary: codeUnits,
            hex: codeUnitsToHex( codeUnits ),
            escape: {
                ascii: ( charCodePoint < 127 ) ? codeUnitsToAsciiEscape( character ) : null, // only for ASCII characters
                unicode: codeUnitsToUnicodeEscape( character ),
            }
        }
    };
}