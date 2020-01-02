// code units of UTF encoding for code point ranges
exports.codeUnitsPerEncodingPerRange = {
    'utf-8': {
        1: [ 0x0, 0x7F ], // 1 code unit for range between 0x0 and 0x7F
        2: [ 0x80, 0x7FF ],
        3: [ 0x800, 0xFFFF ],
        4: [ 0x10000, 0x10FFFF ],
    },
    'utf-16': {
        1: [ 0x0, 0xFFFF ], // surrogates are also included
        2: [ 0x10000, 0x10FFFF ],
    },
    'utf-32': {
        1: [ 0x0, 0x10FFFF ],
    },
};

// length of code unit
exports.codeUnitLengthPerEncoding = {
    'utf-8': 8,
    'utf-16': 16,
    'utf-32': 32
};

// bits used to encode code point (per code units count)
exports.bitsUsedPerEncodingPerCodeUnitsCount = {
    'utf-8': {
        1: 7, // 7 bits when code unit is 1
        2: 11,
        3: 16,
        4: 21,
    },
    'utf-16': {
        1: 16,
        2: 20,
    },
    'utf-32': {
        1: 32,
    },
};

// template used for the code units
exports.codeUnitsTemplatePerEncoding = {
    'utf-8': {
        1: [ '0xxxxxxx' ], // 'x' is a placeholder to replace the actual bit
        2: [ '110xxxxx', '10xxxxxx' ],
        3: [ '1110xxxx', '10xxxxxx', '10xxxxxx' ],
        4: [ '11110xxx', '10xxxxxx', '10xxxxxx', '10xxxxxx' ],
    },
    'utf-16': {
        1: [ 'xxxxxxxxxxxxxxxx' ],
        2: [ '110110xxxxxxxxxx', '110111xxxxxxxxxx' ],
    },
    'utf-32': {
        1: [ 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' ],
    },
};