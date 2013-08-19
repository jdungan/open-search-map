


jQuery(document).ready(function () {
    

    var map_config = { 
        satellite: {id : 'mapbox_satellite',options:{map_url:'jdungan.map-y7hj3ir7'}},
        buildings: {id : 'mapbox_buildings',options:{map_url:'jdungan.map-147y2axb'}},
        terrain: {id : 'mapbox_terrain', options:{map_url:'jdungan.map-lc7x2770'}}
    };
    
    for (var m in map_config) {
        map_config[m].options = map_config[m].options || {};
        search_app.add_base(
            new L.mapbox.tileLayer(map_config[m].options.map_url)
        );
    };

    search_app.map.invalidateSize();
    
    search_app.retrieve_layer_list();



//toggle maps

        $('#mapPage').on('swipeleft', function(e){
            search_app.rotate_map('forward')
        });
        $('#mapPage').on('swiperight', function(e){
            search_app.rotate_map('back')
        });

        $('a#toggle_map').on('click', search_app.rotate_map);
    

//client events


            $(document).on("markerMove", function (e, move_details) {
                search_app.data.place.update(move_details.key,
                    { latitude: move_details.latitude,
                        longitude: move_details.longitude
                    })
                .done(function (response) {
                    $.event.trigger('move_search',response)
                    socket.emit('message', { eventType: 'moveSearch', payload: response });
                });
            });


            $('#map_holder').on('click', 'button.end_search', function() {
                search_app.data.place.update($(this).data('key'),
                    { extra: { end_time: Date()} })
                .done(function (response) {
                    $('.search_map').trigger("end_search", response);
                    socket.emit('message', { eventType: 'endSearch', payload: response });
                });
            });

            //jqm page events 
            // $("#mapPage").on("pageshow", function () {        
            //     search_app.map.invalidateSize();
            //     $('.search_map').trigger('page_resize');
            // });

        //map events

        //general app events

            $('.app_panel').on('click',function(){
                $(this).panel( "close" );            
            });

            $('.cancel_button').on('click',function(){
                $.mobile.changePage('#mapPage');
            });    



        //authentication
            function newUser(auth){
                this_auth=auth;
                search_data.user.create(
                    { username: auth.username,
                        email: auth.username,
                        password: auth.password
                    })
                .done(function (response) {
                    $(this).data('register-user', false);
                    search_data.login(this_auth);
                })
                .fail(function (error) {
                    $('#signin_msg').text(error.error_description);
                });

            };

            $('#signin_page').on('pagebeforeshow', function () {
                var register_user = $(this).data('register-user');

                retype_type = register_user && "password" || "hidden";
                signin_title = register_user && "Registration" || "Sign In";
                signin_btn_text = register_user && "Sign Me Up!" || "Sign In";

                $('#retypePassword').attr('type', retype_type);
                $('#signin_title').text(signin_title)
                $('button#signin').text(signin_btn_text).button("refresh");

                if (register_user) {
                    $('#retypePassword').parent().show();
                } else {
                    $('#retypePassword').parent().hide();
                };
                $(this).trigger("create");
            });

            $('button#signin').on('click', function (e) {
                var auth = {}; auth.username = $('input#email').val(),
                auth.password = $('input#password').val();
                $('#signin_msg').text('');
                if ($('#retypePassword').attr('type') === 'password') {
                    auth.retype = $('input#retypePassword').val();
                    if (auth.password != auth.retype) {
                        $('#signin_msg').text('Passwords do not match')
                    } else {
                        newUser(auth);
                    }
                } else {
                    search_data.login(auth);
                }
            });

            $('button#signin_quit').on('click',function(){
                $('#signin_page').data('register-user',false);
                $('#signin_msg').text(''); 
                $('#retypePassword').attr('type','hidden').parent().hide();
                $('#signin_page').trigger("create");        
            });    

            $('a#btnStartRegister').on('click', function () {
                $('#signin_page').data('register-user', true);
            });

            geoloqi.onAuthorize = function (response, error) {
                search_app.user_response=response
                console.log("You are a user:"+response.display_name);
                $.mobile.changePage('#mapPage');
            };

            geoloqi.onLoginError = function (error) {
                console.log("You are not a user!");
                $('#linkDialog').click();
            };

        //watch position 

            // var posOptions = { enableHighAccuracy: true};
            // var userPositionChange = function(pos) {
            //     new_position = {latitude  : pos.coords.latitude, 
            //                     longitude : pos.coords.longitude,
            //                     accuracy  : pos.coords.accuracy};          
            //     new_position.accuracy = new_position.accuracy > 90 && 90 || new_position.accuracy;
            // 
            //     if (search_app.user_response){
            // 
            //         new_position.user=search_app.user_response;
            //         new_position.user.access_token=null;
            //         socket.emit('message', { eventType: 'moveUser', payload: new_position });
            //     } 
            //     $('#map_holder').trigger('new_user_position',new_position);
            // };
            // var errorPositionChange = function (err) {
            //     console.warn('ERROR(' + err.code + '): ' + err.message);
            // };


            // var posOptions = {
            //   enableHighAccuracy: true,
            //   timeout: 3000,
            //   maximumAge: 0
            // };

            // var distWatchID = navigator.geolocation.watchPosition(userPositionChange, errorPositionChange, posOptions);

            // window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
            //     debugger;
            //   if (gOldOnError)
            //     // Call previous handler.
            //     return gOldOnError(errorMsg, url, lineNumber);
            // 
            //   // Just let default handler run.
            //   return false;
            // }




});