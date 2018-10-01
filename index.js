(function(){

    const { parseCsv } =    window.csv_parser;

    const errorOutput =     document.querySelector( '.csv-parser-error' );
    const inputForm =       document.querySelector( '.csv-parser-input' );
    const inputTextarea =   document.querySelector( '.csv-parser-input > .csv' );
    const outputTable =     document.querySelector( '.csv-parser-output-table' );

    inputForm.onsubmit =    onSubmitInput;

    function onSubmitInput( evt ) {

        evt.preventDefault();

        const csvString =   inputTextarea.value;

        let csvArray =      [];
        try {
            const csvArray =    parseCsv( csvString );
            console.log( csvArray );
            replaceChildren(
                outputTable,
                csvToTbody( csvArray )
            );
        } catch( err ){
            console.error( err );
            replaceChildren(
                errorOutput,
                err.toString()
            );
        }

    }

    function csvToTbody( rows ){

        return h( 'tbody', null, rows.map(
            row => h( 'tr', null, row.map(
                field => h( 'td', null, field )
            ))
        ));

    }

    /// DOM functions ----------------------------------------------------------

    function h( name, attr, children ){

        const el =          document.createElement( name );
        if( attr ) {
            for( const k in attr ){
                el.setAttribute( k, attr[k] );
            }
        }

        if( children ){
            replaceChildren( el, children );
        }

        return el;
    }

    function appendChild( node, child ){

        if( child instanceof Node ){
            node.appendChild( child );
        } else {
            node.appendChild( new Text( child ));
        }
    }

    function replaceChildren( el, children ){

        el.innerHTML =      '';

        if( children instanceof Array ){
            children.forEach( child => appendChild( el, child ))
        } else {
            appendChild( el, children );
        }
    }
})();

