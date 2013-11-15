$(function(){
			
	$("form#formReportar").on("submit", function(e){
		e.preventDefault();
		var formData = $(this).serializeArray();
		url = $(this).attr('action');
		/*
	    $.post(url, formData, function(jsonData) {

			});
		}
		*/
		$.mobile.changePage("#inicio", {transition: "pop"});
		alert("Gracias por su aporte");
		return false;
		
	});
	
	
	$("a#btnNavbarGeneral").on('click', function()
	{
		$("div#listaDirectorioComunas").hide();
		$("div#listaDirectorioGeneral").show();
	});
	
	$("a#btnNavbarComunas").on('click', function()
	{
		$("div#listaDirectorioGeneral").hide();
		$("div#listaDirectorioComunas").show();
	});

	$(document).on('click', "a.irRuta", function(e){
			e.preventDefault();
			var idRuta = $(this).attr('data-ruta');
			alert
			conexion.transaction(function(tx)
			{
				$.mobile.loading('show');
				sql = "SELECT DISTINCT idTipoDirectorio, tipoDirectorio FROM TipoDirectorio JOIN (SELECT * FROM directorio JOIN ruta ON directorio.fkRuta = "+idRuta+" AND ruta.idRuta ="+idRuta+") as con ON TipoDirectorio.idTipoDirectorio = con.fkTipoDirectorio";
				tx.executeSql(sql,[], function(tx, result)
					{
							
							if (result != null && result.rows != null) {
							
							len=result.rows.length;
							$("div#listaDirectorioGeneral").html('');
							for (i = 0; i < len; i++) {
							  row = result.rows.item(i);

							  $("div#listaDirectorioGeneral").append('<div data-role="collapsible" id="tipoDirectorio-'+row.idTipoDirectorio+'"><h2>' + row.tipoDirectorio + '</h2><ul class="descripcionLugar" data-role="listview" style="padding:0px; margin:-10px -15px"></ul>');
							  
							  tx.executeSql('SELECT * FROM (SELECT * FROM directorio JOIN ruta ON directorio.fkRuta = ? AND ruta.idRuta = ?) AS con1 JOIN Lugar ON con1.fkLugar = Lugar.idLugar WHERE fkTipoDirectorio = ?', [idRuta, idRuta, row.idTipoDirectorio],function(tx, resultado) {
							  	if (resultado != null && resultado.rows != null) {
							  			lenComisarias =resultado.rows.length;
							  			
							  			var idTipoDirectorio = resultado.rows.item(0).fkTipoDirectorio;
							  			listaLugares="";
										for (i = 0; i < lenComisarias; i++) {
										  	row = resultado.rows.item(i);
										  	listaLugares += "<li class='ui-li ui-li-static ui-btn-up-d'><h2 class='ui-li-heading'>" + row.nombreLugar + "</h2>";
										  	if(row.direccionLugar!=null)
										  	{
										  		listaLugares += "<p class='ui-li-desc'><strong>"+ row.direccionLugar+ "</p>";
										  	}
										  	if(row.telefonosLugar!=null)
										  	{
										  		listaLugares += "<p class='ui-li-desc'>"+row.telefonosLugar +"</p>";
											}

										  	listaLugares +="</li>";
										}
										
										$("div#tipoDirectorio-"+idTipoDirectorio + " ul.descripcionLugar").html(listaLugares);
									}
								});
							  }

							$('div#listaDirectorioGeneral').find('div[data-role=collapsible]').collapsible({refresh:true});  
							$.mobile.changePage("#pageDirectorio", {transition: "slide"});
						  }
					$.mobile.loading('hide');
				}
			);	

	var $listaDirectorioComunas = $("#listaDirectorioComunas");
				if($listaDirectorioComunas.html().trim()=="")
				{
						 $listaDirectorioComunas.append('<div data-role="collapsible" id="tipoLugarComisarias"><h2>Comisarias</h2><ul class="descripcionLugar" data-role="listview" style="padding:0px; margin:-10px -15px"></ul>');
							  
							  tx.executeSql('SELECT * FROM Lugar WHERE fkTipoLugar = 2', [],function(tx, resultado) {
							  	if (resultado != null && resultado.rows != null) {
							  			len2 =resultado.rows.length;
							  			
							  			var idTipoDirectorio = resultado.rows.item(0).fkTipoDirectorio;
							  			listaLugaresComisarias="";
										for (i = 0; i < resultado.rows.length; i++) {
										  	row = resultado.rows.item(i);
										  	listaLugaresComisarias += "<li class='ui-li ui-li-static ui-btn-up-d'><h2 class='ui-li-heading'>" + row.nombreLugar + "</h2>";
										  	if(row.direccionLugar!=null)
										  	{
										  		listaLugaresComisarias += "<p class='ui-li-desc'><strong>"+ row.direccionLugar+ "</p>";
										  	}
										  	if(row.telefonosLugar!=null)
										  	{
										  		listaLugaresComisarias += "<p class='ui-li-desc'>"+row.telefonosLugar +"</p>";
											}

										  	listaLugaresComisarias +="</li>";
										}
										
										$("div#tipoLugarComisarias ul.descripcionLugar").html(listaLugaresComisarias);

										
									}
								});

	$listaDirectorioComunas.find('div[data-role=collapsible]').collapsible({refresh:true});  
	}

	});

	return false;
	});

	//Fecha Actual
	now = new Date();
    month = (now.getMonth() + 1);               
    day = now.getDate();
    if(month < 10) 
        month = "0" + month;
    if(day < 10) 
        day = "0" + day;
    today = now.getFullYear() + '-' + month + '-' + day;
	$("#fechaReportar").val(today);
});