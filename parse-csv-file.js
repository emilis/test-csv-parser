const fs =              require( 'fs' );
const path =            require( 'path' );

const { parseCsv } =    require( './csv-parser' );

/// Main -----------------------------------------------------------------------

if( process.argv.length === 3 ) {
    console.log(
        parseCsv(
            fs.readFileSync( process.argv[2], 'utf8' )
        )
    );
} else {
    console.error( 'Usage:', process.argv[1], 'your-file.csv' );
}



