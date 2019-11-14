const _ = require( 'lodash' );
const chalk = require( 'chalk' );
const unicodeSubstring = require('unicode-substring');

// import decoder function
const { getEncodingData } = require('./src/utils' );

// export default entry function
module.exports = ( _character, _encoding = 'utf-8' ) => {

    // check if valid character is provided
    if( ! _.isString( _character ) || _.isEmpty( _character ) ) {
        throw new Error( chalk.red( 'Error in utf-info: Provide a valid ASCII or Unicode character.' ) );
    }

    // get first character if string is provided
    const character = unicodeSubstring( _character, 0, 1 );

    // if encoding is provided, check if it is a valid encoding scheme
    const encoding = _.toLower( _encoding );
    if( ! _.includes( [ 'utf-8', 'utf-16', 'utf-32' ], encoding ) ) {
        throw new Error( chalk.red( 'Error in utf-info: Provide a valid Unicode encoding scheme.' ) );
    }

    // return encoding scheme
    return getEncodingData( character, encoding );

};
