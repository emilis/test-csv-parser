(function(exports){

    /// Constants --------------------------------------------------------------

    const S_BEGIN =         'S_BEGIN';
    const S_NEXT =          'S_NEXT';
    const S_QUOTED =        'S_QUOTED';

    const RECORD_SEP =      '\n';
    const FIELD_SEP =       ',';
    const QUOTE =           '"';

    /// Exports ----------------------------------------------------------------

    Object.assign( exports, {
        parseCsv,
    });

    /// Functions --------------------------------------------------------------

    function parseCsv( str = '' ) {

        const LENGTH =      str.length;

        let field =         '';
        let record =        [];
        let result =        [];

        let pos =           0;
        let state =         S_BEGIN;

        while( pos < LENGTH ) {
            switch( state ) {

                case S_BEGIN:
                    switch( str[pos] ) {
                        case FIELD_SEP:
                            record.push( field );
                            field =     '';
                            pos++;
                            break;
                        case QUOTE:
                            state =     S_QUOTED;
                            field =     '';
                            pos++;
                            break;
                        case RECORD_SEP:
                            record.push( field );
                            field =     '';
                            result.push( record );
                            record =    [];
                            pos ++;
                            break;
                        default:
                            /// TODO: optimize
                            field +=    str[pos];
                            pos++;
                    }
                    break;

                case S_QUOTED:
                    const quotePos =    str.indexOf( QUOTE, pos );

                    if( quotePos === -1 ) {
                        /// quote not found:
                        throw Error( 'Unclosed quote in string at ' + ( pos - 1 ));
                    } else if( str[quotePos + 1] === QUOTE ) {
                        /// two quotes in sequence:
                        field +=    str.slice( pos, quotePos ) + QUOTE;
                        pos =       quotePos + 2;
                    } else {
                        /// ending quote:
                        field +=    str.slice( pos, quotePos );
                        record.push( field );
                        field =     '';
                        state =     S_NEXT;
                        pos =       quotePos + 1;
                    }
                    break;
                case S_NEXT:
                    /// Field text has ended. Search for next field separator.

                    switch( str[pos] ) {
                        /// ignore spaces after last quote:
                        case ' ':
                            pos++;
                            break;
                        case FIELD_SEP:
                            state =      S_BEGIN;
                            pos++;
                            break;
                        case RECORD_SEP:
                            result.push( record );
                            record =    [];
                            state =     S_BEGIN;
                            pos++;
                            break;
                        default:
                            throw Error( 'Field or record separator was expeceted at ' + pos + '. Found: "' + str[pos] + '"' );
                    }
                    break;
            } /// end of switch( state )
        }/// end of while()

        record.push( field );
        result.push( record );

        return result;
    }
})(typeof module !== 'undefined' ? module.exports : (window.csv_parser = {}));
