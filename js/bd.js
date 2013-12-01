var conexion=0;

function iniciarBD(){

		conexion =  window.openDatabase("approsa", "1.0", "approsa", 200000);
		conexion.transaction(function(tx)
		{
			tx.executeSql("create TABLE IF NOT EXISTS Version(idVersion integer primary key, fechaVersion text)");
			tx.executeSql("SELECT idVersion FROM Version WHERE idVersion=1;", [], verificarVersion);

		});
}

var verificarVersion = function (tx, results) {
		// Primera vez que ingresa a la aplicación

		var primeraVez = results.rows.length==0;
		tx.executeSql("SELECT idVersion FROM Version WHERE idVersion=1 and julianday('now') - julianday(fechaVersion) > 5; ", [], function (tx, results2) {
	
				var len = results2.rows.length;
				
				//Si lleva mas de 5 dias busca una actualizacion
				if(len>0 || primeraVez)
				{
					
					$.ajax({
					contentType: "json",
					url: "http://www.medellin.gov.co/api/v1/vivemujer/listado.json",
					success: function(result){
						actualizarBD(result);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
					   
					    	if(primeraVez==true)
					    {
					    	$.ajax({
								contentType: "json",
								url: "default.bd",
								success: function(results3){
									data = jQuery.parseJSON(results3);
									actualizarBD(data);
								}
							});

					    }   
				   }
				 });	
				}
				else
				{
					vistaCategoriaTip = new VistaCategoriaTip();
				}
			});
	};

var actualizarBD = function(json){
		conexion.transaction(function(tx)
		{
			tiposLugar = json['tipolugar'];
			lugares = json['lugar'];
			categoriasTip = json['categoriatip'];
			rutas = json['ruta'];
			tips = json['tip'];
			tiposDirectorio = json['tipodirectorio'];
			directorios = json['directorio'];

			sentenciasEliminarTablas = new Array
			(
				"DROP TABLE IF EXISTS Directorio",
				"DROP TABLE IF EXISTS Lugar",
				"DROP TABLE IF EXISTS TipoDirectorio",
				"DROP TABLE IF EXISTS TipoLugar",
				"DROP TABLE IF EXISTS Tip",
				"DROP TABLE IF EXISTS CategoriaTip",
				"DROP TABLE IF EXISTS Ruta",
				"DROP TABLE IF EXISTS Version"
			);		
			
			sentenciasTablas = new Array
			(
				"create TABLE IF NOT EXISTS Version(idVersion integer primary key, fechaVersion text)",
				"create TABLE IF NOT EXISTS Ruta(idRuta integer primary key,nombreRuta text)",
				"create TABLE IF NOT EXISTS CategoriaTip(idCategoriaTip integer primary key,Categoria text, descripcionTip text)",
				"create TABLE IF NOT EXISTS Tip(idTip integer primary key,tip text,fkCategoriaTip integer,fkRuta integer, FOREIGN KEY(fkCategoriaTip) REFERENCES CategoriaTip(idCategoriaTip),FOREIGN KEY(fkRuta) REFERENCES Ruta(idRuta))",
				"create TABLE IF NOT EXISTS TipoLugar(idTipoLugar integer primary key,tipoLugar text)",
				"create TABLE IF NOT EXISTS TipoDirectorio(idTipoDirectorio integer primary key, tipoDirectorio text)",
				"create TABLE IF NOT EXISTS Lugar(idLugar integer primary key,nombreLugar text, direccionLugar text, telefonosLugar text, latitudLugar text, longitudLugar text, masInformacionLugar text, fkTipoLugar integer,FOREIGN KEY(fkTipoLugar) REFERENCES TipoLugar(idTipoLugar))",
				"create TABLE IF NOT EXISTS Directorio(idDirectorio integer primary key, fkLugar integer,fkRuta integer,fkTipoDirectorio integer,FOREIGN KEY(fkLugar) REFERENCES Lugar(idLugar), FOREIGN KEY(fkTipoDirectorio) REFERENCES TipoDirectorio(idTipoDirectorio), FOREIGN KEY(fkRuta) REFERENCES Ruta(idRuta))"
			);
								
			for(i=0, len = sentenciasEliminarTablas.length; i < len; i++)
			{
				tx.executeSql(sentenciasEliminarTablas[i]);
			}
				
			for(i=0, len = sentenciasTablas.length; i < len; i++)
			{
				tx.executeSql(sentenciasTablas[i]);
			}
			
			for(i=0;i<rutas.length;i++){
				
				tx.executeSql("INSERT INTO Ruta(idRuta,nombreRuta) VALUES (?,?)",[rutas[i].idRuta, rutas[i].nombreRuta]);
			}
			

			for(i=0;i<tiposLugar.length;i++){
				
				tx.executeSql("INSERT INTO TipoLugar(idTipoLugar, tipoLugar) VALUES (?,?)",[tiposLugar[i].idTipoLugar, tiposLugar[i].tipoLugar]);
			}								


			for(i=0;i<categoriasTip.length;i++){
				
				tx.executeSql("INSERT INTO CategoriaTip(idCategoriaTip,Categoria,descripcionTip) VALUES (?,?,?)",[categoriasTip[i].idCategoriaTip, categoriasTip[i].Categoria, categoriasTip[i].descripcionTip]);
			}

			
			for(i=0;i<tiposDirectorio.length;i++){
				
				tx.executeSql("INSERT INTO TipoDirectorio(idTipoDirectorio,tipoDirectorio) VALUES (?,?)",[tiposDirectorio[i].idTipoDirectorio, tiposDirectorio[i].tipoDirectorio]);
			}	

			for(i=0;i<tips.length;i++){
				
				tx.executeSql("INSERT INTO Tip(idTip,tip, fkCategoriaTip, fkRuta) VALUES (?,?,?,?)",[tips[i].idTip, tips[i].tip, tips[i].fkCategoriaTip, tips[i].fkRuta]);
			}

			for(i=0;i<lugares.length;i++){					
				tx.executeSql("INSERT INTO Lugar(idLugar,nombreLugar,direccionLugar,telefonosLugar,latitudLugar,longitudLugar,masInformacionLugar,fkTipoLugar) VALUES(?,?,?,?,?,?,?,?)", [lugares[i].idLugar, lugares[i].nombreLugar, lugares[i].direccionLugar, lugares[i].telefonosLugar, lugares[i].latitudLugar,
										lugares[i].longitudLugar, lugares[i].masInformacionLugar, lugares[i].fkTipoLugar
										]);
			}	

			for(i=0;i<directorios.length;i++){
				
				tx.executeSql("INSERT INTO Directorio(idDirectorio,fkLugar,fkTipoDirectorio,fkRuta) VALUES (?,?,?,?)",[directorios[i].idDirectorio, directorios[i].fkLugar,
					directorios[i].fkTipoDirectorio, directorios[i].fkRuta]);
			}
			
			var now = new Date();
			dia = now.getDate();
			mes = now.getMonth()+1;
			agno = now.getFullYear();
			fecha = agno + "-" + mes + "-" + dia;
			tx.executeSql('INSERT INTO Version(idVersion, fechaVersion) VALUES (?,?)',[1, fecha]);
			vistaCategoriaTip = new VistaCategoriaTip();
			$.mobile.loading( 'hide' );
		});
	};		