$(function(){

    $('#mapaRutas').live('pageshow', function(){  

        $map =  $('#map_canvas');
        $('#map_canvas').gmap(
                {'center': '6.253872,-75.572312',
                 'zoom': 12,
                 'zoomControl': true
                });
        
        $map.gmap('option', 'zoom', 12);
        $('#map_canvas').gmap('refresh');
        
       
    });
    
var actualizarPosicionActual = function()
{
       
        $map =  $('#map_canvas');
        $map.gmap('getCurrentPosition', function(position, status) {
        if ( status === 'OK' ) {
            var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $map.gmap('addMarker', {'position': clientPosition, 'bounds': true});
            $map.gmap('addShape', 'Circle', { 
                'strokeWeight': 0, 
                'fillColor': "#008595", 
                'fillOpacity': 0.25, 
                'center': clientPosition, 
                'radius': 8, 
                'clickable': false 
            });
            
            $map.gmap('option', 'zoom', 15);
            $map.gmap('refresh');
        }
    });
}   

$(document).on('click', '.irMapa a', function(event) {
 
        var $map =  $('#map_canvas');
        $map.gmap('clear', 'markers');

        var idRuta = $(this).attr('data-ruta');
       
        conexion.transaction(function(tx)
        {
            sql = "SELECT * FROM (SELECT * FROM directorio JOIN ruta ON directorio.fkRuta = "+idRuta+" AND ruta.idRuta = "+idRuta+") AS con1 JOIN Lugar ON con1.fkLugar = Lugar.idLugar";

                tx.executeSql(sql,[], function(tx, result)
                {
                       
                    if (result != null && result.rows != null && result.rows.length>0)
                    {
                        try
                        {
                            $.mobile.loading( 'show', {
                                text: "Cargando ubicaciones",
                                textVisible: true,
                                theme: "a",
                                textonly: false,
                                html: ""
                            });

                            len=result.rows.length;
                            $map =  $('#map_canvas');
                            $map.gmap('clear', 'markers');

                            for (i = 0; i < len; i++)
                            {

                                  row = result.rows.item(i);

                                  if(row.latitudLugar != "null" && row.longitudLugar != "null")
                                    {
                                        alert(row.latitudLugar + "..." + row.longitudLugar);
                                        var position = new google.maps.LatLng(row.latitudLugar, row.longitudLugar);
                                        var content = "";
                                        content += "<h2 class='ui-li-heading'>" + row.nombreLugar + "</h2>";
                                        if(row.direccionLugar!=null)
                                        {
                                            content += "<p class='ui-li-desc'><strong>"+ row.direccionLugar+ "</p>";
                                        }
                                        if(row.telefonosLugar!=null)
                                        {
                                            content += "<p class='ui-li-desc'>"+row.telefonosLugar +"</p>";
                                        }

                                        $map.gmap('addMarker', {'position': position, 'bounds': true}).click(function() {
                                                        $('#map_canvas').gmap('openInfoWindow', { 'content': content }, this);
                                                });
                                    }
                                    
                            }

                             $.mobile.loading( 'hide' );
                        }
                        catch(err)
                        {
                             $.mobile.loading( 'hide' );
                            alert("error: " + err);
                           
                        }

                       

                    }
                    
                    $('#map_canvas').gmap('refresh');

                });
            });
   });
});