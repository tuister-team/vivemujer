function enviarReporte(){

	if(navigator.connection.type != Connection.NONE)
		{

			$telefono = $("#reportar_telefono");
			$direccion = $("#reportar_direccion");
			$descripcion = $("textarea#reportar_descripcion");

			if($telefono.val()==null || $telefono.val().length==0){

				mostrarAlert("Datos incompletos", "Por favor ingrese un teléfono");
				$telefono.focus();
			}
			else if($direccion.val()==null || $direccion.val().length==0){

				mostrarAlert("Datos incompletos", "Por favor ingrese una dirección");
				$direccion.focus();
			}
			else 
			{	if($descripcion.val() == null || $descripcion.val().length==0)
					{

						mostrarAlert("Datos incompletos", "Por favor ingrese una descripción");
						descripcion.focus();
					}
				else
					{

						$.mobile.loading( 'show' );

						navigator.geolocation.getCurrentPosition(
				    			function(posicion)
				    			{
				    				reportar(posicion.coords.latitude, posicion.coords.longitude);
				    
				    			},
				    			function(error)
				    			{
				    				reportar("6.246108", "-75.575136");
				    			}
				    		);					    	
			    	}
		    }
		}			    	
		else
		{
				$.mobile.loading( 'hide' );
		 	    mostrarAlert("Error", "Necesita conexión a internet");
		 }
	}

	function reportar(latitud, longitud)
	{
		var url = "http://www.medellin.gov.co/api/v1/vivemujer/guardar.json";
		var fecha = getFecha()+"T"+getHora();
		var sexo = ($("#radioFemenino").is(":checked"))?"F":"M";
		var descripcion = $("textarea#reportar_descripcion").text();

			$.ajax({
				url: url,
				type: "POST",
				dataType: 'jsonp',
				crossDomain: true,
				data: {
					telefonoContacto: $("#reportar_telefono").val(),
					direccionContacto: $("#reportar_direccion").val(),
					SexoContacto: sexo,
					LatitudReporte: latitud,
					LongitudReporte: longitud,
					fechaReporte: fecha,
					descripcion: descripcion
					},
				success:function(data,status)
					{
						$.mobile.loading( 'hide' );
						mostrarAlert("Reportar" + data, data.mensaje);
						$.mobile.changePage("#inicio", {transition: "pop"});

					},
				error: function(result) {
					$.mobile.loading( 'hide' );
	                 mostrarAlert("Error", "Verifique su conexión a internet");

	                }
			});
	}