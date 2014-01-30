	function mostrarAlert(Titulo, contenido)
	{
		navigator.notification.alert(
		     contenido,    
		     function(){},         
		     Titulo,  
		    'OK' 
		);
	}
	
	function getFecha()
	{
		//Fecha Actual
		now = new Date();
	    month = (now.getMonth() + 1);               
	    day = now.getDate();

	    
	    if(month < 10) 
	        month = "0" + month;
	    if(day < 10) 
	        day = "0" + day;
	    
	    fechaActual = now.getFullYear() + '-' + month + '-' + day;
	    return fechaActual;
	}

	function getHora()
	{

		now = new Date();
		hours = now.getHours();
	    minutes = now.getMinutes();
	    seconds = now.getSeconds();

	    if(hours < 10) 
	        hours = "0" + hours;
	    if(minutes < 10) 
	        minutes = "0" + minutes;
	    if(seconds < 10) 
	        seconds = "0" + seconds;

	    horaActual = hours + ':' + minutes + ':' + seconds + ".000";
	    return horaActual;
	}
