		var CategoriaTip = Backbone.Model.extend({
			defaults:{
				idCategoriaTip: '',
				categoria: '',
				descripcion: ''
			}
		});

		var ListaCategoriaTip = Backbone.Collection.extend({

			model: CategoriaTip,	
			url: '/CategoriasTip'
		});

		var VistaCategoriaTip = Backbone.View.extend({
	
		id: tips,
		
		initialize: function(){
			this.render();
		},
		
		render : function()
		{
			this.collection = new ListaCategoriaTip();
			var self = this;
			$("div#tips").html('');
			conexion = window.openDatabase("approsa", "1.0", "approsa", 200000);
			conexion.transaction(function(transaction) {
			   transaction.executeSql('SELECT * FROM CategoriaTip;', [],
				 function(tx, result) {
				  if (result != null && result.rows != null) {
					for (i = 0; i < result.rows.length; i++) {
					  row = result.rows.item(i);
					  self.collection.push(
						  	new CategoriaTip({
								idCategoriaTip: row.idCategoriaTip,
								categoria: row.categoria,
								descripcion: row.descripcion
						  	}));

					  $("div#tips").append('<div data-role="collapsible" data-collapsed="true" id="CategoriaTip-'+row.idCategoriaTip+'"><h3>' + row.descripcionTip + '</h3><span class="descripcionCategorias"></span></div>');
					  
					  tx.executeSql('SELECT * FROM Tip WHERE fkCategoriaTip = ?', [row.idCategoriaTip],function(tx, result) {
					  	if (result != null && result.rows != null) {
					  			idCategoriaTip = result.rows.item(0).fkCategoriaTip;
					  			listaTips="<ul>";
								for (i = 0; i < result.rows.length; i++) {
								  	row = result.rows.item(i);
								  	listaTips += "<li><h4>" + row.tip + "</h4>" + 
								  				 "<p> Si tú o alguna mujer cercana a ti ha pasado por esto, han sido o están siendo víctimas " +
								  				 "<a href='#' class='irRuta' data-ruta='"+ row.fkRuta + "''> Aquí te pueden ayudar</a></p></li>";
								}

								listaTips += "</ul>";
								$("div#CategoriaTip-"+idCategoriaTip + " span.descripcionCategorias").html(listaTips);
							}
						});
					  }

					$('div#tips').find('div[data-role=collapsible]').collapsible({refresh:true});  
				  }
				 },this.errorHandler);
			 }, this.errorHandler, this.nullHandler);
			 
			 return this;
		}
	});