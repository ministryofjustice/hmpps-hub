( function ( speak ) {
    speak.pageCode(["knockout"], function (ko) {
        var reserved = ["initialize", "initialized", "get", "set", "render", "serialize"];
		window.onerror = function(errorMsg, url, lineNumber) {
			if(!window.jsErrors) { window.jsErrors = new Array(); }
			window.jsErrors.push(errorMsg + "\n" + url + ":" + lineNumber); 
		}
        var getMembers = function (rendering, app) {
            try {
                var componentname = rendering.itemName;
                var component = app.findComponent("ReferenceComponent");
                var $modelMembersSection = $( "#modelMembers" );
                var $tabelBodyForMembers = $modelMembersSection.find( "tbody" );
                var $publicMethodsMembers = $( "#publicMethodsMembers" );
                var $tabelPublicMethodsMembers = $publicMethodsMembers.find( "tbody" );

                var data = {
                    modelMembers: [],
                    methodMembers: []
                };

                if (component != null) {
                    for ( var prop in component.__properties ) {
                        if (component.__properties.hasOwnProperty(prop)) {
                            data.modelMembers.push( { name: prop } );
                        }
                    }

                    for (var member in component) {
                        if ( typeof component[member] === "function" ) {
                            if (reserved.indexOf(member) < 0 && member.indexOf("_") < 0) {
                                data.methodMembers.push( {
                                    name: member
                                } );
                            }
                        }
                    }

                    $modelMembersSection.toggle( data.modelMembers.length > 0 );

                    data.modelMembers.forEach(function (p) {
                        $tabelBodyForMembers.append( "<tr><td>" + p.name + "</td></tr>" );
                    } );

                    data.methodMembers.forEach( function ( p ) {
                        $tabelPublicMethodsMembers.append( "<tr><td>" + p.name + "</td></tr>" );
                    } );


                }
            } catch (e) {
                alert("The Model Members and View Members section cannot be rendered as an empty control could not be created.\n\n" + e);
            }
        };

        return {
            initialized: function () {
                if (!window.rendering) {
                    return;
                }

                getMembers(window.rendering, this);
                //this.runJasmine();
            }
        };
    });
}(Sitecore.Speak));