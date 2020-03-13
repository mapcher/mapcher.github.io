ymaps.ready(init);
var doNotMakeHash=false;
var yashare, yashare2;
var unlinkZooms=false;
var polygon=[];
var polygonNumber=0;
var whitePanesArray=[];
//'ground','areas','places','events','overlaps'
var blackPanesArray=['ground','places','events','overlaps','panel','routerEditorGlass'];
//'editor','editorGuideLines','panel','routerEditorGlass','editorDrawOver'
var myMap=['', ''], primaryIndex, secondaryIndex, rotatingMapIndex;
var zoomControl=['',''];
var smallZoomControl=['',''];
var zoomControlState=['',''];
var mapsWidth=100,mapsHeight=100,verticalDivider=50,horizontalDivider=50;
var float=['left', 'right'];
var angle=[];
angle[0]=0;
angle[1]=0;
var orientation='horizontal';
var dividerThickness=20;
var YMver='2-1-29';

var Coeff=[];


var resizeMaps=function(){
	if (orientation==='vertical') {
		$('#mapContainer0').height(verticalDivider);
		$('#mapContainer1').height(mapsHeight-verticalDivider);
		$('#mapContainer0').width(mapsWidth);
		$('#mapContainer1').width(mapsWidth);
		$('#verticalDivider').css('top',verticalDivider-dividerThickness/2);
	}
	else{
		$('#mapContainer0').width(horizontalDivider);
		$('#mapContainer1').width(mapsWidth-horizontalDivider);
		$('#mapContainer0').height(mapsHeight);
		$('#mapContainer1').height(mapsHeight);
		$('#horizontalDivider').css('left',horizontalDivider-dividerThickness/2)
	};
	for (var i=0;i<myMap.length;i++){
		resizeMap(i);			
	}
};

var resizeMap=function(mapNumber) {
		var mapContainerWidth, mapContainerHeight, mapSize, top, left, xCenter, yCenter;

		mapContainerWidth=$('#mapContainer'+mapNumber).width();
		mapContainerHeight=$('#mapContainer'+mapNumber).height();

		if (mapContainerHeight<320) {
			if (zoomControlState[mapNumber]==='small'){

			}
			else{
				myMap[mapNumber].controls.add(smallZoomControl[mapNumber]);	
				myMap[mapNumber].controls.remove(zoomControl[mapNumber]);
				//var zc=myMap[mapNumber].controls.get('zoomControl');	
				//zc.options.set('size', 'small');	
				zoomControlState[mapNumber]='small';	
			};
		}
		else{
			if (zoomControlState[mapNumber]==='big'){

			}
			else{
				myMap[mapNumber].controls.add(zoomControl[mapNumber]);	
				myMap[mapNumber].controls.remove(smallZoomControl[mapNumber]);	
				zoomControlState[mapNumber]='big';
				//var zc=myMap[mapNumber].controls.get('zoomControl');	
				//zc.options.set('size', 'big');	
			};
		};

		mapSize=Math.sqrt( mapContainerWidth*mapContainerWidth + mapContainerHeight*mapContainerHeight);
		top=(mapContainerHeight-mapSize)/2;
		left=(mapContainerWidth-mapSize)/2;
		$('#map'+mapNumber).width(mapSize+'px');
		$('#map'+mapNumber).height(mapSize+'px');
		myMap[mapNumber].container.fitToViewport();
		$('#map'+mapNumber).css({
			'top':''+(top)+'px',
			'left':''+(left)+'px'
		});
		
		xCenter=mapSize/2;
		yCenter=mapSize/2;

		var css={
    			'-webkit-transform-origin':''+xCenter+'px '+(yCenter)+'px',
    			'-moz-transform-origin':''+xCenter+'px '+(yCenter)+'px',
    			'-o-transform-origin':''+xCenter+'px '+(yCenter)+'px',
    			'-ms-transform-origin':''+xCenter+'px '+(yCenter)+'px',
    			'transform-origin':''+xCenter+'px '+(yCenter)+'px'};

		for (var paneName in whitePanesArray){
			$(myMap[mapNumber].panes.get(whitePanesArray[paneName]).getElement()).css(css);
		};
		for (var paneName in blackPanesArray){
			$('#map'+mapNumber+' .ymaps-'+YMver+'-'+blackPanesArray[paneName]+'-pane').css(css);		
		};

		$(myMap[mapNumber].panes.get('copyrights').getElement()).css({
		'left' : (10+(-left))+'px', 'right' : (3+(-left))+'px', 'bottom': (5+(-top))+'px'
     		});  

		$(myMap[mapNumber].panes.get('controls').getElement()).css({
		'width': 'auto',
		'left' : ((-left))+'px', 'right' : ((-left))+'px', 'top': ((-top))+'px'
     		});  
		$('#map'+mapNumber+' .ymaps-'+YMver+'-searchpanel-pane').css({
		'width': 'auto',
		'left' : ((-left))+'px', 'right' : ((-left))+'px', 'top': ((-top))+'px'
     		});  

		$('#map'+mapNumber+' .ymaps-'+YMver+'-controls__bottom').css({
		'top' : (mapContainerHeight)+'px'
     		});  

};

function updateUrls(){
	location.hash=makeHash();
	yashare.updateShareLink(location);
	yashare2.updateShareLink(location);
};



function init(){ 

	$('#reset').click(function(e){
		$.removeCookie('Hash', { path: '/' });
		location.hash='reset';
		location.reload(true);
	});
	$('#vertical').click(function(e){
		orientation='vertical';
		$('#verticalDivider').show();
		$('#horizontalDivider').hide();
		resizeMaps();
	});
	$('#horizontal').click(function(e){
		orientation='horizontal';
		$('#horizontalDivider').show();
		$('#verticalDivider').hide();
		resizeMaps();
	});
	$('#verticalDivider').hide();

	$('#en').click(function(e){
		location.hash="l=e";
		$.cookie('Hash',makeHash().replace('l=r','l=e'), { expires: 365, path: '/' });
		location.reload(true);
	});
	$('#ru').click(function(e){
		location.hash="l=r";
		$.cookie('Hash',makeHash().replace('l=e','l=r'), { expires: 365, path: '/' });
		location.reload(true);
	});

	var options = {avoidFractionalZoom : false,
			propagateEvents : true, 
			suppressMapOpenBlock : true};

	var googleLayer = function () {
		var layer = new ymaps.Layer('http://mt0.google.com/vt/lyrs=m@176000000&hl=ru&%c', {
			projection: ymaps.projection.sphericalMercator
		});
		layer.getCopyrights = function(coords, zoom) {
			return ymaps.vow.resolve(["<a href='http://maps.google.com/'><img src='https://maps.gstatic.com/mapfiles/api-3/images/google_white2.png'></a> Картографические данные © 2015 <a href='http://maps.google.com/'>Google</a>"]);
		};
		return layer;
	};

	ymaps.layer.storage.add('google#aerial', googleLayer);
	var googleType = new ymaps.MapType('Google', ['google#aerial']);
	ymaps.mapType.storage.add('google#map', googleType);

													
	var googleEarthLayer = function () {
		var layer = new ymaps.Layer('http://khm3.google.ru/kh/v=39&hl=ru&x=%x&y=%y&z=%z', {
			projection: ymaps.projection.sphericalMercator
		});
		layer.getCopyrights = function(coords, zoom) {
			return ymaps.vow.resolve(["<a href='http://maps.google.com/'><img src='https://maps.gstatic.com/mapfiles/api-3/images/google_white2.png'></a> Картографические данные © 2015 <a href='http://maps.google.com/'>Google</a>"]);
		};
		return layer;
	};

	ymaps.layer.storage.add('google#earth', googleEarthLayer);
	var googleEarthType = new ymaps.MapType('GoogleEarth', ['google#earth']);
	ymaps.mapType.storage.add('google#earth', googleEarthType);

	
	var osmLayer = function () {
		var layer = new ymaps.Layer('http://tile.openstreetmap.org/%z/%x/%y.png', {
        	projection: ymaps.projection.sphericalMercator
		});
		layer.getCopyrights = function(coords, zoom) {
			return ymaps.vow.resolve(["© <a href='http://openstreetmap.org/'>OpenStreetMap</a> contributors, CC-BY-SA"]);
		};
 	   	return layer;
	};
	ymaps.layer.storage.add('osm#aerial', osmLayer);
	var osmType = new ymaps.MapType('OSM', ['osm#aerial']);
	ymaps.mapType.storage.add('osm#map', osmType);

	for (var i=0;i<myMap.length;i++){

		myMap[i] = new ymaps.Map("map"+i, {
			center: [59.939, 30.315],
			zoom: 7,
			controls: [],
			behaviors:["drag","scrollZoom","dblClickZoom","multiTouch"]
		},options ); 

		if (l10n.locale==='ru-RU'){
			var TS=myMap[i].controls.add(new ymaps.control.TypeSelector(['yandex#publicMap', 'yandex#map', 'google#map', 'google#earth', 'yandex#satellite', 'osm#map']), { float: float[i]});
		}
		else{
			var TS=myMap[i].controls.add(new ymaps.control.TypeSelector(['yandex#map', 'google#map', 'google#earth', 'yandex#satellite', 'osm#map']), { float: float[i]});			
		};

		var geolocationButton = new ymaps.control.Button({
			data: {
				// Зададим иконку для кнопки
				image: 'images/geolocation.png',
				// Текст на кнопке.
				//content: 'Где я?',
				// Текст всплывающей подсказки.
				//title: 'Где я?'
			},
			options: {
				selectOnClick: false,
				maxWidth: [30]
			}
		});
		geolocationButton.events.add('click', function () {
			var geolocation = ymaps.geolocation;
			geolocation.get({
				provider: 'auto',
				mapStateAutoApply: true
			}).then(function (result) {
				myMap[primaryIndex].setCenter(result.geoObjects.get(0).geometry.getCoordinates());
    			myMap[primaryIndex].setZoom(14);
			});

		});
		myMap[i].controls.add(geolocationButton, { float: float[i], floatIndex: 300});
		
		var searchButton=new ymaps.control.SearchControl({options:{ float: float[i]}});
		myMap[i].controls.add(searchButton);
		myMap[i].controls.add(new ymaps.control.RouteEditor({options:{ float: float[i]}}));
		myMap[i].controls.add(new ymaps.control.RulerControl({options:{ scaleLine: true}}));
	
		var contourButton = new ymaps.control.Button({
			data: {
				// Зададим иконку для кнопки
				image: 'images/contour.png',
				// Текст на кнопке.
				//content: 'Контур',
				// Текст всплывающей подсказки.
				//title: 'Rонтур'
			},
			options: {
				// Зададим опции для кнопки.
				//selectOnClick: false,
				// Кнопка будет иметь три состояния - иконка, текст и иконка+текст.
				// Поэтому зададим три значения ширины кнопки для всех состояний.
				maxWidth: [30]
			}
		});
		contourButton.events.add('select', function () {
			doNotMakeHash=true;
			for (var n=1; n<=polygonNumber; n++) {
				polygon[n].editor.startEditing();
			};
			polygonNumber=polygonNumber+1;
			polygon[polygonNumber] = new ymaps.Polygon([],{},{
					syncOverlayInit: true,
					draggable: true
			});
			//polygon.options.draggable=true;
			polygon[polygonNumber].number=polygonNumber;
			polygon[polygonNumber].options.set('geodesic',true);
			polygon[polygonNumber].events.add('click', swapPolygon);	
			myMap[primaryIndex].geoObjects.add(polygon[polygonNumber]);
			polygon[polygonNumber].editor.startDrawing();
			//resizeMaps();
			//rotatePanes(i);
		});
		contourButton.events.add('deselect', function () {
			for (var n=1; n<=polygonNumber; n++) {
				polygon[n].editor.stopEditing();
				doNotMakeHash=false;
			};
			resizeMaps();
			updateUrls();
		});
		myMap[i].controls.add(contourButton, { float: float[i]});

		var cookie1=getCookie();
		var hash1=getHash();

		if (cookie1['a'+i]===undefined){	
		}
		else{
			angle[i]=parseFloat(cookie1['a'+i]);
		};		
		if (hash1['a'+i]===undefined){	
		}
		else{
			angle[i]=parseFloat(hash1['a'+i]);
		};		
		
		var compassButton = new ymaps.control.Button({
			data: {
				// Зададим иконку для кнопки
				//image: 'images/compass.png',
				// Текст на кнопке.
				//content: 'К',
				// Текст всплывающей подсказки.
				title: 'Компас'
			},
			options: {
				// Зададим опции для кнопки.
				layout: ymaps.templateLayoutFactory.createClass(
					"<div style='transform: rotate("+angle[i]+"deg)' class='compass ymaps-"+YMver+"-button ymaps-"+YMver+"-button_size_s ymaps-"+YMver+"-button_theme_normal ymaps-"+YMver+"-button_icon_only' style='max-width: 90px' title=''>"+
						"<div class='ymaps-"+YMver+"-button__text'>"+
							"<div class='ymaps-"+YMver+"-button__icon'>"+
							"<img src='images/compass.png'>"+
							"</div>"+
							"<div class='ymaps-"+YMver+"-button__title' style='display: none;'>"+
							"</div>"+
						"</div>"+
					"</div>"
				),
				selectOnClick: false,
				// Кнопка будет иметь три состояния - иконка, текст и иконка+текст.
				// Поэтому зададим три значения ширины кнопки для всех состояний.
				maxWidth: [30]
			}
		});
		compassButton.events.add('click', function () {
			angle[primaryIndex]=0;
			rotatePanes(primaryIndex);
		});
		myMap[i].controls.add(compassButton, { float: float[i]});


		

		myMap[i].events.add('boundschange',  function (e) {
			if (myMap[primaryIndex]===e.originalEvent.map) {
				var newZoom=e.get('newZoom');
				var primaryCenter=myMap[primaryIndex].getCenter();
				var secondaryCenter=myMap[secondaryIndex].getCenter();
				var lat=[];
				var primaryLat=primaryCenter[0]*Math.PI/180;
				var secondaryLat=secondaryCenter[0]*Math.PI/180;
				Coeff[primaryIndex]=1/Math.cos(primaryLat);
				Coeff[secondaryIndex]=1/Math.cos(secondaryLat);
				if (!unlinkZooms){
					myMap[secondaryIndex].setZoom(newZoom+(Math.log(Coeff[primaryIndex]/Coeff[secondaryIndex])/Math.log(2)));				
				};

				//updateUrls();

			};
			rotatePanesBoth();
		});


		myMap[i].events.add('mouseenter',  function (e) {
			if (e.originalEvent.map===myMap[0]){
				primaryIndex=0;
				secondaryIndex=1;	
			}
			else{
				primaryIndex=1;
				secondaryIndex=0;	
			};
			document.onmousedown=function(e){
				if (e.which===1){
					var X=e.clientX;
					var Y=e.clientY;
					document.onmousemove=function(e){
						var DeltaX=e.clientX-X;
						var DeltaY=e.clientY-Y;
						X=e.clientX;
						Y=e.clientY;
						var Angle=angle[primaryIndex]/180*Math.PI;
						var DeltaXG=DeltaX*Math.cos(Angle)+DeltaY*Math.sin(Angle);
						var DeltaYG=DeltaY*Math.cos(Angle)-DeltaX*Math.sin(Angle);
						var position = myMap[primaryIndex].getGlobalPixelCenter();
						myMap[primaryIndex].setGlobalPixelCenter([ position[0] -DeltaXG, position[1]-DeltaYG ]);
						rotatePanesBoth();
					};
					document.onmouseup=function(){
						document.onmousemove=function(e){};
					};
				}
				else if (e.which===3){
					rotatingMapIndex=primaryIndex;
					var X=e.clientX;
					var Y=e.clientY;
					document.onmousemove=function(e){
						var xCenter=$('#mapContainer'+rotatingMapIndex).position().left+$('#mapContainer'+rotatingMapIndex).width()/2;//mapDiv.offsetWidth/2;
						var yCenter=$('#mapContainer'+rotatingMapIndex).position().top+$('#mapContainer'+rotatingMapIndex).height()/2;//mapDiv.offsetHeight/2;
						var alpha=(Math.atan2(e.clientY-yCenter-25,e.clientX-xCenter)-Math.atan2(Y-yCenter-25,X-xCenter))/Math.PI*180;
						angle[rotatingMapIndex]=angle[rotatingMapIndex]+alpha;

						rotatePanes(rotatingMapIndex);

						X=e.clientX;
						Y=e.clientY;
					};
					document.onmouseup=function(){
						document.onmousemove=function(e){};
					};
				};
			};
			resizeMap(primaryIndex);
		});

		myMap[i].events.add('mouseleave',  function (e) {
			document.onmousedown=function(){};	
		}); 

		$('#mapContainer'+i+' .handle'+i).addClass('handleShow');


	$("#handle"+i).draggable({
		start: function(e) {
				rotatingMapIndex=primaryIndex;
				var X=e.pageX;
				var Y=e.pageY;
				document.onmousemove=function(e){
					var xCenter=$('#mapContainer'+rotatingMapIndex).position().left+$('#mapContainer'+rotatingMapIndex).width()/2;
					var yCenter=$('#mapContainer'+rotatingMapIndex).position().top+$('#mapContainer'+rotatingMapIndex).height()/2;
					var alpha=(Math.atan2(e.clientY-yCenter-25,e.clientX-xCenter)-Math.atan2(Y-yCenter-25,X-xCenter))/Math.PI*180;
					angle[rotatingMapIndex]=angle[rotatingMapIndex]+alpha;


					rotatePanes(rotatingMapIndex);


					X=e.clientX;
					Y=e.clientY;
				};
				document.onmouseup=function(){
					document.onmousemove=function(e){};
				};

		},
		drag: function() {


		},
		stop: function() {


		},
		containment: "parent", scroll: false
	});
	}
	$(window).mouseup(function(){
		if (!doNotMakeHash){
			updateUrls();			
		};
	});
		
	zoomControl[0]=new ymaps.control.ZoomControl({options: {size:'auto',position: { left: 10, top: 58}}});
	smallZoomControl[0]=new ymaps.control.ZoomControl({options: {size:'small',position: { left: 10, top: 58}}});
	myMap[0].controls.add(zoomControl[0]);
	zoomControlState[0]='big';
	zoomControl[1]=new ymaps.control.ZoomControl({options: {size:'auto',position: { right: 10, top: 58}}});
	smallZoomControl[1]=new ymaps.control.ZoomControl({options: {size:'small',position: { right: 10, top: 58}}});
	myMap[1].controls.add(zoomControl[1]);
	zoomControlState[1]='big';

	$('.menu').click(function() {
		$('#menu').css({'left':'-200px'});
	});
	$('.menuOption').click(function() {
		$('#menu').css({'left':'-200px'});
	});



	var menuButton = new ymaps.control.Button({
		data: {
			image: 'images/menu.png',
		},
		options: {
			selectOnClick: false,
			maxWidth: [30]
		}
	});

	menuButton.events.add('press', function () {
		$('#menu').css({'left':'0px'});
	});

	myMap[0].controls.add(menuButton, { float: 'left', floatIndex: 300 });

	var unlinkZoomsButton = new ymaps.control.Button({
		data: {
			image: 'images/unlinkZooms.png',
				// Текст всплывающей подсказки.
			title: 'Независимый зум'
		},
		options: {
			selectOnClick: true,
			maxWidth: [30]
		}
	});

	unlinkZoomsButton.events.add('select', function () {
		unlinkZooms=true;
	});
	unlinkZoomsButton.events.add('deselect', function () {
		unlinkZooms=false;
	});

	myMap[1].controls.add(unlinkZoomsButton, { float: 'right', floatIndex: 300 });


	resizeMaps();
	$('.ymaps-'+YMver+'-search').mouseenter(function(){
		resizeMaps();
	});

	$("#horizontalDivider").draggable({
		cursorAt: { left: (dividerThickness/2) },
		drag: function() {
			horizontalDivider=parseInt($(this).css('left'))+dividerThickness/2;
			resizeMaps();
		},
		axis: "x",
		containment: "parent"
	});
	$("#verticalDivider").draggable({
		cursorAt: { top: (dividerThickness/2) },
		drag: function() {
			verticalDivider=parseInt($(this).css('top'))+dividerThickness/2;
			resizeMaps();
		},
		axis: "y",
		containment: "parent"
	});
	
	$(window).resize(onWindowResize);
	$(window).unload(saveCookies);
	var cookies=getCookie();
	loadHashToCookies(getHash(),cookies);
	loadCookies(cookies);
	onWindowResize();
	rotatePanesBoth();

	$('.ymaps-'+YMver+'-image').click(function(){
		$(this).css("background-image:'images/ru.png'");
	});



	yashare=new Ya.share({
        element: 'ya_share',
            elementStyle: {
                'type': 'button',
                'border': false,
                'quickServices': []
            },
            l10n:l10n.lang,
            title:l10n.title,
            link:location,
            description:l10n.description,
            popupStyle: {
                blocks: ['facebook', 'vkontakte', 'odnoklassniki', 'twitter',
						'gplus',
						'liveinternet',
						'lj',
						'moimir',
						'myspace',
						'surfingbird'
					]
                ,
                copyPasteField: true
            },
            serviceSpecific: {
                twitter: {
                    title: '#'+l10n.title
               }
        }
	});	
	yashare2=new Ya.share({
        element: 'ya_share2',
            elementStyle: {
                'type': 'none',
                'border': false,
                'quickServices': ['facebook', 'vkontakte', 'odnoklassniki', 'twitter']
            },
            l10n:l10n.lang,
            title:l10n.title,
            link:location,
            description:l10n.description,
            popupStyle: {
                blocks: []
                ,
                copyPasteField: true
            },
            serviceSpecific: {
                twitter: {
                    title: '#'+l10n.title
               }
        }
	});	

};

var onClickOnEventsPane = function(e) {
	text='';
	for (var i in e){
		text=text+i+':'+e[i]+'\n';
	};
	alert(text);
};

var swapPolygon=function (e) {
				var polygon1=e.get('target');
				var delta=[];
				delta[0]=myMap[secondaryIndex].getCenter()[0]-myMap[primaryIndex].getCenter()[0];
				delta[1]=myMap[secondaryIndex].getCenter()[1]-myMap[primaryIndex].getCenter()[1];

				var primaryCenter=myMap[primaryIndex].getCenter();
				var secondaryCenter=myMap[secondaryIndex].getCenter();
				var lat=[];
				var primaryLat=primaryCenter[0]*Math.PI/180;
				var secondaryLat=secondaryCenter[0]*Math.PI/180;
				Coeff[primaryIndex]=1/Math.cos(primaryLat);
				Coeff[secondaryIndex]=1/Math.cos(secondaryLat);

				
				var coefShiroty=Coeff[secondaryIndex]/Coeff[primaryIndex];

				var coordinates=polygon1.geometry.getCoordinates();
				for (var i in coordinates) {
					//alert(''+i+' : '+coordinates[i]);
					for (var j=0; j<coordinates[i].length-1; j++) {
						//alert(''+i+'-'+j+' : '+coordinates[i][j]);
						coordinates[i][j][0]=coordinates[i][j][0]+delta[0];
						coordinates[i][j][1]=coordinates[i][j][1]+delta[1];

						coordinates[i][j][1]=coordinates[0][0][1]+(coordinates[i][j][1]-coordinates[0][0][1])*coefShiroty;

					};
				};
				myMap[primaryIndex].geoObjects.remove(polygon1);

				myMap[secondaryIndex].geoObjects.add(polygon1);
				resizeMaps();
				updateUrls();
			};

function getCookie() {
	var data = {};
	var hash2=unescape($.cookie('Hash'));
	if(hash2) {
		var pair = (hash2).split('&');
		for(var i = 0; i < pair.length; i ++) {
			var param = pair[i].split('=');
			if(param[1]==='NaN'){
			}
			else{
				data[param[0]] = param[1];				
			};
		}
	}
	return data;
};
function getHash() {
	var data = {};
	var hash2=unescape(location.hash);
	if(hash2) {
		var pair = (hash2.substr(1)).split('&');
		for(var i = 0; i < pair.length; i ++) {
			var param = pair[i].split('=');
			if(param[1]==='NaN'){
			}
			else{
				data[param[0]] = param[1];				
			};
		}
	}
	return data;
};

var loadHashToCookies=function(hash,cookies){
	for (var n in hash){
		if (hash[n]===undefined){	
		}
		else{
			cookies[n]=hash[n];
		};	
	};	
};


var loadCookies=function(cookies){
	if (cookies['h']===undefined){	
	}
	else{
		horizontalDividerPercentage=Math.min(parseFloat(cookies['h']),0.99);
		horizontalDivider=horizontalDividerPercentage*mapsWidth;
	};		
	if (cookies['v']===undefined){	
	}
	else{
		verticalDividerPercentage=Math.min(parseFloat(cookies['v']),0.99);
		verticalDivider=verticalDividerPercentage*mapsHeight;
	};		
	if (cookies['o']===undefined){	
	}
	else{
		orientation=cookies['o'];
		if (orientation==='vertical'){
			$('#horizontalDivider').hide();
			$('#verticalDivider').show();
		}
		else{
			orientation='horizontal';
			$('#horizontalDivider').show();
			$('#verticalDivider').hide();
		};
	};		
	for (var i=0; i<2; i++){
		if (cookies['t'+i]===undefined){	
		}
		else{
			if(l10n.locale==='ru-RU'){
				myMap[i].setType(cookies['t'+i]);
			}
			else{
				if(cookies['t'+i]==='yandex#publicMap'){
				}
				else{
					myMap[i].setType(cookies['t'+i]);
				};
			};
		};		

		if (cookies['A'+i]===undefined){	
		}
		else{
			if (cookies['L'+i]===undefined){	
			}
			else{
				var Alt=parseFloat(cookies['A'+i]);
				var Lon=parseFloat(cookies['L'+i]);
				myMap[i].setCenter([Alt,Lon]);
			};		
		};		

		
		if (cookies['a'+i]===undefined){	
		}
		else{
			angle[i]=parseFloat(cookies['a'+i]);
		};		
		if (cookies['Z'+i]===undefined){	
		}
		else{
			myMap[i].setZoom(cookies['Z'+i]);	
		};

		if (cookies['p'+i]===undefined){	
		}
		else if (cookies['p'+i]===''){	
		}
		else{
			var polygons=JSON.parse(cookies['p'+i]);
			if (polygons.length>0){
				myMap[i].geoObjects.each(function (geoObject) {
    				geoObject.getMap().geoObjects.remove(geoObject);
					//polygonNumber=polygonNumber-1;
				});
			};
			for (var m in polygons){
				var geometry=polygons[m];
					if (geometry.length>0){
						polygonNumber=polygonNumber+1;
						polygon[polygonNumber] = new ymaps.Polygon(geometry,{},{
								syncOverlayInit: true,
								draggable: true
						});
						//polygon.options.draggable=true;
						polygon[polygonNumber].number=polygonNumber;
						polygon[polygonNumber].options.set('geodesic',true);
						polygon[polygonNumber].events.add('click', swapPolygon);	
						myMap[i].geoObjects.add(polygon[polygonNumber]);

					};
				
			};
		};		
	};

};

var saveCookies=function(){
	if ((location.hash==='#reset')||(location.hash==='#l=e')||(location.hash==='#l=r')){
	}
	else{
		$.cookie('Hash',makeHash(), { expires: 365, path: '/' });
	}
};



var onWindowResize=function (){
	horizontalDividerPercentage=horizontalDivider/mapsWidth;
	verticalDividerPercentage=verticalDivider/mapsHeight;
	mapsWidth=Math.max($('#maps').width(),1);
	mapsHeight=Math.max($('#maps').height(),1);
	horizontalDivider=mapsWidth*horizontalDividerPercentage;
	verticalDivider=mapsHeight*verticalDividerPercentage;
	resizeMaps();	
};

function rotatePanesBoth(){
	rotatePanes(0);
	rotatePanes(1);
};

function rotatePanes(index) {
	var degrees=''+(angle[index])+'deg';
	for (var paneName in whitePanesArray){
		$(myMap[index].panes.get(whitePanesArray[paneName]).getElement()).rotate(degrees);
	};
	for (var paneName in blackPanesArray){
		$('#map'+index+' .ymaps-'+YMver+'-'+blackPanesArray[paneName]+'-pane').rotate(degrees);		
	};
	$('#map'+index+' .compass').rotate(degrees);		
	$('.handle'+index).rotate(degrees);
	//location.hash=makeHash();

};

function makeHash() {
	params={};
	

	params['A0']=myMap[0].getCenter()[0].toFixed(6);
	params['A1']=myMap[1].getCenter()[0].toFixed(6);
	params['L0']=myMap[0].getCenter()[1].toFixed(6);
	params['L1']=myMap[1].getCenter()[1].toFixed(6);
	params['Z0']=myMap[0].getZoom().toFixed(3);
	params['Z1']=myMap[1].getZoom().toFixed(3);
	params['a0']=angle[0].toFixed(3);
	params['a1']=angle[1].toFixed(3);
	params['t0']=myMap[0].getType();
	params['t1']=myMap[1].getType();
	params['h']=(horizontalDivider/mapsWidth).toFixed(3);
	params['v']=(verticalDivider/mapsHeight).toFixed(3);
	params['o']=orientation;
	params['l']=l10n.locale.charAt(0);
		var polygons=[];
	myMap[0].geoObjects.each(function (geoObject) {
    	polygons.push(geoObject.geometry.getCoordinates());
	});	
	var polygonsString=JSON.stringify(polygons);
	params['p0']=polygonsString;
	
	var polygons=[];
	myMap[1].geoObjects.each(function (geoObject) {
    	polygons.push(geoObject.geometry.getCoordinates());
	});	
	var polygonsString=JSON.stringify(polygons);
	params['p1']=polygonsString;

	var hash='';
	for (var i in params){
		hash=hash+'&'+i+'='+params[i];
	};
	hash=hash.substr(1);


	return hash;
};

