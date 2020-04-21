let doNotMakeHash = false;
let yashare, yashare2;
let unlinkZooms = false;
const polygon = [];
let polygonNumber = 0;
const whitePanesArray = [];
//'ground','areas','places','events','overlaps'
const blackPanesArray = ['searchpanel', 'controls'];
//'ground', 'places', 'events', 'overlaps', 'panel', 'routerEditorGlass'
const myMap = ['', ''];
let primaryIndex, secondaryIndex, rotatingMapIndex;
const zoomControl = ['', ''];
const smallZoomControl = ['', ''];
const zoomControlState = ['', ''];
let mapsWidth, mapsHeight, verticalDivider, horizontalDivider;
const float = ['left', 'right'];
const angle = [0, 0];
let orientation = 'horizontal';
const dividerThickness = 20;
const YMver = '2-1-76';

const Coefficient = [];

const resizeMaps = function () {
	const mapsWidth=Math.max($('#maps').width(),1);
	const mapsHeight=Math.max($('#maps').height(),1);
	if (orientation === 'vertical') {
		$('#mapContainer0').height(verticalDivider);
		$('#mapContainer1').height(mapsHeight-verticalDivider);
		$('#mapContainer0').width(mapsWidth);
		$('#mapContainer1').width(mapsWidth);
		$('#verticalDivider').css('top',verticalDivider-dividerThickness/2);
	} else {
		$('#mapContainer0').width(horizontalDivider);
		$('#mapContainer1').width(mapsWidth-horizontalDivider);
		$('#mapContainer0').height(mapsHeight);
		$('#mapContainer1').height(mapsHeight);
		$('#horizontalDivider').css('left',horizontalDivider-dividerThickness/2);
	}
	for (let i = 0; i < myMap.length; i++) {
		resizeMap(i);
	}
};

const resizeMap=function(mapNumber) {
	let mapContainerWidth, mapContainerHeight, mapSize, top, left, xCenter, yCenter;
	const mapContainer = $('#mapContainer'+mapNumber);
	mapContainerWidth=mapContainer.width();
	mapContainerHeight=mapContainer.height();

	if (mapContainerHeight<320) {
		if (zoomControlState[mapNumber]==='small'){

		}
		else{
			myMap[mapNumber].controls.add(smallZoomControl[mapNumber]);
			myMap[mapNumber].controls.remove(zoomControl[mapNumber]);
			//zoomControl[mapNumber].options.size='small';
			// или
			//var zc=myMap[mapNumber].controls.get('zoomControl');
			//zc.options.set('size', 'small');
			zoomControlState[mapNumber]='small';
		}
	}
	else{
		if (zoomControlState[mapNumber]==='big'){

		}
		else{
			myMap[mapNumber].controls.add(zoomControl[mapNumber]);
			myMap[mapNumber].controls.remove(smallZoomControl[mapNumber]);
			zoomControlState[mapNumber]='big';
			//zoomControl[mapNumber].options.size='large';
			// или
			//var zc=myMap[mapNumber].controls.get('zoomControl');
			//zc.options.set('size', 'big');
		}
	}

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

	xCenter=mapContainerWidth/2;
	yCenter=mapContainerHeight/2;

	const rotationCenter = '' + xCenter + 'px ' + (yCenter) + 'px';

	const css = {
		'-webkit-transform-origin': rotationCenter,
		'-moz-transform-origin': rotationCenter,
		'-o-transform-origin': rotationCenter,
		'-ms-transform-origin': rotationCenter,
		'transform-origin': rotationCenter
	};

	for (const paneName in whitePanesArray){
		$(myMap[mapNumber].panes.get(whitePanesArray[paneName]).getElement()).css(css);
		//$(myMap[mapNumber].panes.get(whitePanesArray[paneName]).getElement()).css({'position':'absolute'});
	}
	for (const paneName in blackPanesArray){
		$('#map'+mapNumber+' .ymaps-'+YMver+'-'+blackPanesArray[paneName]+'-pane').css(css);
		//$('#map'+mapNumber+' .ymaps-'+YMver+'-'+blackPanesArray[paneName]+'-pane').css({'position':'absolute'});
	}

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

const updateUrls = function (){
	location.hash=makeHash();
	//yashare.updateShareLink(location);
	//yashare2.updateShareLink(location);
};

const makeContourButton = function() {
	const contourButton = new ymaps.control.Button({
		data: {
			// Зададим иконку для кнопки
			image: 'img/contour.png',
			// Текст на кнопке.
			content: 'Контур',
			// Текст всплывающей подсказки.
			title: 'Контур'
		},
		options: {
			// Зададим опции для кнопки.
			selectOnClick: false,
			// Кнопка будет иметь три состояния - иконка, текст и иконка+текст.
			// Поэтому зададим три значения ширины кнопки для всех состояний.
			maxWidth: [30]
		}
	});
	contourButton.events.add('select', function () {
		doNotMakeHash=true;
		for (let n=1; n<=polygonNumber; n++) {
			polygon[n].editor.startEditing();
		}
		polygonNumber=polygonNumber+1;
		polygon[polygonNumber] = new ymaps.Polygon([],{},{
			syncOverlayInit: true,
			draggable: true
		});
		polygon[polygonNumber].options.set('draggable',true);
		polygon[polygonNumber].number=polygonNumber;
		polygon[polygonNumber].options.set('geodesic',true);
		polygon[polygonNumber].events.add('click', swapPolygon);
		myMap[primaryIndex].geoObjects.add(polygon[polygonNumber]);
		polygon[polygonNumber].editor.startDrawing();
		//resizeMaps();
		//rotatePanes(i);
	});
	contourButton.events.add('deselect', function () {
		for (let n=1; n<=polygonNumber; n++) {
			polygon[n].editor.stopEditing();
			doNotMakeHash=false;
		}
		resizeMaps();
		updateUrls();
	});
	return contourButton;
};

const makeGeolocationButton = function() {
	const geolocationButton = new ymaps.control.Button({
		data: {
			// Зададим иконку для кнопки
			image: 'img/geolocation.png',
			// Текст на кнопке.
			content: 'Где я?',
			// Текст всплывающей подсказки.
			title: 'Где я?'
		},
		options: {
			selectOnClick: false,
			maxWidth: [30]
		}
	});
	geolocationButton.events.add('click', function () {
		const geolocation = ymaps.geolocation;
		geolocation.get({
			provider: 'auto',
			mapStateAutoApply: true
		}).then(function (result) {
			myMap[primaryIndex].setCenter(result.geoObjects.get(0).geometry.getCoordinates());
			myMap[primaryIndex].setZoom(14);
		});

	});
	return geolocationButton;
};

const makeCompassButton = function (mapIndex) {
	const cookie1 = getCookie();
	const hash1 = getHash();

	if (!(cookie1['a'+mapIndex]===undefined)){
		angle[mapIndex]=parseFloat(cookie1['a'+mapIndex]);
	}
	if ((!hash1['a'+mapIndex]===undefined)){
		angle[mapIndex]=parseFloat(hash1['a'+mapIndex]);
	}

	const compassButton = new ymaps.control.Button({
		data: {
			// Зададим иконку для кнопки
			image: 'img/compass.png',
			// Текст на кнопке.
			content: 'К',
			// Текст всплывающей подсказки.
			title: 'Компас'
		},
		options: {
			// Зададим опции для кнопки.
			layout: ymaps.templateLayoutFactory.createClass(
				"<div style='transform: rotate(" + angle[mapIndex] + "deg)' class='compass ymaps-" + YMver + "-button ymaps-" + YMver + "-button_size_s ymaps-" + YMver + "-button_theme_normal ymaps-" + YMver + "-button_icon_only' style='max-width: 90px' title=''>" +
				"<div class='ymaps-" + YMver + "-button__text'>" +
				"<div class='ymaps-" + YMver + "-button__icon'>" +
				"<img src='img/compass.png'>" +
				"</div>" +
				"<div class='ymaps-" + YMver + "-button__title' style='display: none;'>" +
				"</div>" +
				"</div>" +
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
	return compassButton;
};

const bindActionsToMenu = function() {
	$('#reset').on( "click", function(e){
		$.removeCookie('Hash', { path: '/' });
		location.hash='reset';
		location.reload();
	});

	$('#vertical').on( "click", function(e){
		orientation='vertical';
		$('#verticalDivider').show();
		$('#horizontalDivider').hide();
		resizeMaps();
	});
	$('#horizontal').on( "click", function(e){
		orientation='horizontal';
		$('#horizontalDivider').show();
		$('#verticalDivider').hide();
		resizeMaps();
	});

	$('#en').on( "click", function(e){
		location.hash="l=e";
		$.cookie('Hash',makeHash().replace('l=r','l=e'), { expires: 365, path: '/' });
		location.reload();
	});
	$('#ru').on( "click", function(e){
		location.hash="l=r";
		$.cookie('Hash',makeHash().replace('l=e','l=r'), { expires: 365, path: '/' });
		location.reload();
	});

};

const addThirdLayers = function() {

	const googleLayer = function () {
		const layer = new ymaps.Layer('http://mt0.google.com/vt/lyrs=m@176000000&hl=ru&%c', {
			projection: ymaps.projection.sphericalMercator
		});
		layer.getCopyrights = function (coords, zoom) {
			return ymaps.vow.resolve(["<a href='http://maps.google.com/'><img src='https://maps.gstatic.com/mapfiles/api-3/images/google_white2.png'></a> Map data © 2020 <a href='http://maps.google.com/'>Google</a>"]);
		};
		return layer;
	};
	ymaps.layer.storage.add('google#aerial', googleLayer);
	const googleType = new ymaps.MapType('Google', ['google#aerial']);
	ymaps.mapType.storage.add('google#map', googleType);

	/*const googleEarthLayer = function () {
		const layer = new ymaps.Layer('http://khm3.google.ru/kh/v=39&hl=ru&x=%x&y=%y&z=%z', {
			projection: ymaps.projection.sphericalMercator
		});
		layer.getCopyrights = function (coords, zoom) {
			return ymaps.vow.resolve(["<a href='http://maps.google.com/'><img src='https://maps.gstatic.com/mapfiles/api-3/images/google_white2.png'></a> Map data © 2020 <a href='http://maps.google.com/'>Google</a>"]);
		};
		return layer;
	};
	ymaps.layer.storage.add('google#earth', googleEarthLayer);
	const googleEarthType = new ymaps.MapType('GoogleEarth', ['google#earth']);
	ymaps.mapType.storage.add('google#earth', googleEarthType);*/


	const osmLayer = function () {
		const layer = new ymaps.Layer('http://tile.openstreetmap.org/%z/%x/%y.png', {
			projection: ymaps.projection.sphericalMercator
		});
		layer.getCopyrights = function (coords, zoom) {
			return ymaps.vow.resolve(["© <a href='http://openstreetmap.org/'>OpenStreetMap</a> contributors, CC-BY-SA"]);
		};
		return layer;
	};
	ymaps.layer.storage.add('osm#aerial', osmLayer);
	const osmType = new ymaps.MapType('Open Street Maps', ['osm#aerial']);
	ymaps.mapType.storage.add('osm#map', osmType);
};

const onBoundsChange = function (e) {
	if (myMap[primaryIndex]===e.originalEvent.map) {
		const newZoom = e.get('newZoom');
		const primaryCenter = myMap[primaryIndex].getCenter();
		const secondaryCenter = myMap[secondaryIndex].getCenter();
		const lat = [];
		const primaryLat = primaryCenter[0] * Math.PI / 180;
		const secondaryLat = secondaryCenter[0] * Math.PI / 180;
		Coefficient[primaryIndex]=1/Math.cos(primaryLat);
		Coefficient[secondaryIndex]=1/Math.cos(secondaryLat);
		if (!unlinkZooms){
			myMap[secondaryIndex].setZoom(newZoom+(Math.log(Coefficient[primaryIndex]/Coefficient[secondaryIndex])/Math.log(2)));
		}
		updateUrls();
	}
	rotatePanesBoth(); // эта строка новая
};

const onMouseEnter = function (e) {
	if (e.originalEvent.map===myMap[0]){
		primaryIndex=0;
		secondaryIndex=1;
	}
	else{
		primaryIndex=1;
		secondaryIndex=0;
	}
	document.onmousedown=function(e){
		let Y;
		let X;
		if (e.which === 1) {
			X = e.clientX;
			Y = e.clientY;
			document.onmousemove=function(e){
				const DeltaX = e.clientX - X;
				const DeltaY = e.clientY - Y;
				X=e.clientX;
				Y=e.clientY;
				const Angle = angle[primaryIndex] / 180 * Math.PI;
				const DeltaXG = DeltaX * Math.cos(Angle) + DeltaY * Math.sin(Angle);
				const DeltaYG = DeltaY * Math.cos(Angle) - DeltaX * Math.sin(Angle);
				const position = myMap[primaryIndex].getGlobalPixelCenter();
				myMap[primaryIndex].setGlobalPixelCenter([ position[0] -DeltaXG, position[1]-DeltaYG ]);
				rotatePanes(primaryIndex); // эта строка новая
			};
			document.onmouseup=function(){
				rotatePanes(primaryIndex); // эта строка новая
				document.onmousemove=function(e){};
			};
		}
		else if (e.which===3){
			rotatingMapIndex=primaryIndex;
			X = e.clientX;
			Y = e.clientY;
			document.onmousemove=function(e){
				const xCenter = $('#mapContainer' + rotatingMapIndex).position().left + $('#mapContainer' + rotatingMapIndex).width() / 2;//mapDiv.offsetWidth/2;
				const yCenter = $('#mapContainer' + rotatingMapIndex).position().top + $('#mapContainer' + rotatingMapIndex).height() / 2;//mapDiv.offsetHeight/2;
				const alpha = (Math.atan2(e.clientY - yCenter - 25, e.clientX - xCenter) - Math.atan2(Y - yCenter - 25, X - xCenter)) / Math.PI * 180;
				angle[rotatingMapIndex]=angle[rotatingMapIndex]+alpha;

				rotatePanes(rotatingMapIndex);

				X=e.clientX;
				Y=e.clientY;
			};
			document.onmouseup=function(){
				document.onmousemove=function(e){};
			};
		}
	};
	resizeMap(primaryIndex);
};

const onMouseLeave = function (e) {
	document.onmousedown=function(){};
};

const addControls = function (i) {
	myMap[i].controls.add(makeGeolocationButton(), { float: float[i], floatIndex: 300});
	myMap[i].controls.add(new ymaps.control.SearchControl({options: {float: float[i]}}));
	//myMap[i].controls.add(new ymaps.control.RouteEditor({options:{ float: float[i]}}));
	myMap[i].controls.add(new ymaps.control.RulerControl({options:{ scaleLine: true}}));
	//myMap[i].controls.add(makeContourButton(), { float: float[i]});
	//myMap[i].controls.add(makeCompassButton(i), { float: float[i]});
};

const addEvents = function (i) {
	myMap[i].events.add('boundschange', onBoundsChange);
	myMap[i].events.add('mouseenter',  onMouseEnter);
	myMap[i].events.add('mouseleave', onMouseLeave);
};

const addZoomControls = function () {
	zoomControl[0]=new ymaps.control.ZoomControl({options: {size:'auto',position: { left: 10, top: 58}}});
	smallZoomControl[0]=new ymaps.control.ZoomControl({options: {size:'small',position: { left: 10, top: 58}}});
	myMap[0].controls.add(zoomControl[0]);
	zoomControlState[0]='big';
	zoomControl[1]=new ymaps.control.ZoomControl({options: {size:'auto',position: { right: 10, top: 58}}});
	smallZoomControl[1]=new ymaps.control.ZoomControl({options: {size:'small',position: { right: 10, top: 58}}});
	myMap[1].controls.add(zoomControl[1]);
	zoomControlState[1]='big';
};

const addMenuButton = function() {
	const menuButton = new ymaps.control.Button({
		data: {
			image: 'img/menu.png',
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
};

const addUnlinkButton = function() {
	const unlinkZoomsButton = new ymaps.control.Button({
		data: {
			image: 'img/unlinkZooms.png',
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
};

const setDividersDraggableProperties = function() {
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
};

const addYaShares = function() {
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

const init = function (){
	verticalDivider = $('#maps').height() / 2;
	horizontalDivider = $('#maps').width() / 2;
	bindActionsToMenu();
	addThirdLayers();
	const options = {avoidFractionalZoom : false,
		propagateEvents : true,
		suppressMapOpenBlock : true}; // эта строка новая
	for (let i=0; i<myMap.length; i++){
		myMap[i] = new ymaps.Map("map"+i, {
			center: [59.939, 30.315],
			zoom: 7,
			controls: [],
			behaviors:["drag","scrollZoom","dblClickZoom","multiTouch"]
		},options );
		if (l10n.locale==='ru-RU'){
			const TS=myMap[i].controls.add(new ymaps.control.TypeSelector(['yandex#publicMap', 'yandex#map', 'google#map', 'yandex#satellite', 'osm#map']), { float: float[i]});
		}
		else{
			const TS=myMap[i].controls.add(new ymaps.control.TypeSelector(['yandex#map', 'google#map', 'yandex#satellite', 'osm#map']), { float: float[i], panoramasItemMode: 'off'});
		}
		addControls(i);
		addEvents(i);
		/*
		$('#mapContainer'+i+' .handle'+i).addClass('handleShow');

		$("#handle"+i).draggable({
			start: function(e) {
				rotatingMapIndex=primaryIndex;
				let X = e.pageX;
				let Y = e.pageY;
				document.onmousemove=function(e){
					const xCenter = $('#mapContainer' + rotatingMapIndex).position().left + $('#mapContainer' + rotatingMapIndex).width() / 2;
					const yCenter = $('#mapContainer' + rotatingMapIndex).position().top + $('#mapContainer' + rotatingMapIndex).height() / 2;
					const alpha = (Math.atan2(e.clientY - yCenter - 25, e.clientX - xCenter) - Math.atan2(Y - yCenter - 25, X - xCenter)) / Math.PI * 180;
					angle[rotatingMapIndex]=angle[rotatingMapIndex]+alpha;

					rotatePanes(rotatingMapIndex);

					X=e.clientX;
					Y=e.clientY;
				};
				document.onmouseup=function(){
					document.onmousemove=function(e){};
				};
			},
			drag: function() {},
			stop: function() {},
			containment: "parent",
			scroll: false
		});
		*/
	}
	$(window).mouseup(function(){
		if (!doNotMakeHash){
			updateUrls();
		}
	});
	addZoomControls();
	$('.menu').on('click', function() {
		$('#menu').css({'left':'-200px'});
	});
	$('.menuOption').on('click', function() {
		$('#menu').css({'left':'-200px'});
	});

	addMenuButton();
	addUnlinkButton();

	resizeMaps();
	$('.ymaps-'+YMver+'-search').mouseenter(function(){
		resizeMaps();
	});

	setDividersDraggableProperties();

	$(window).resize(onWindowResize);
	$(window).unload(saveCookies);
	const cookies = getCookie();
	loadHashToCookies(getHash(),cookies);
	loadCookies(cookies);
	onWindowResize();
	rotatePanesBoth();

	$('.ymaps-'+YMver+'-image').on('click', function(){
		$(this).css("background-image:'img/ru.png'");
	});
	addYaShares();
};

const swapPolygon=function (e) {
	const polygon1 = e.get('target');
	const delta = [];
	delta[0]=myMap[secondaryIndex].getCenter()[0]-myMap[primaryIndex].getCenter()[0];
	delta[1]=myMap[secondaryIndex].getCenter()[1]-myMap[primaryIndex].getCenter()[1];

	const primaryCenter = myMap[primaryIndex].getCenter();
	const secondaryCenter = myMap[secondaryIndex].getCenter();
	const lat = [];
	const primaryLat = primaryCenter[0] * Math.PI / 180;
	const secondaryLat = secondaryCenter[0] * Math.PI / 180;
	Coefficient[primaryIndex]=1/Math.cos(primaryLat);
	Coefficient[secondaryIndex]=1/Math.cos(secondaryLat);


	const longitudeCoefficient = Coefficient[secondaryIndex] / Coefficient[primaryIndex];

	const coordinates = polygon1.geometry.getCoordinates();
	for (const i in coordinates) {
		//alert(''+i+' : '+coordinates[i]);
		for (let j=0; j<coordinates[i].length-1; j++) {
			//alert(''+i+'-'+j+' : '+coordinates[i][j]);
			coordinates[i][j][0]=coordinates[i][j][0]+delta[0];
			coordinates[i][j][1]=coordinates[i][j][1]+delta[1];

			coordinates[i][j][1]=coordinates[0][0][1]+(coordinates[i][j][1]-coordinates[0][0][1])*longitudeCoefficient;

		}
	}
	myMap[primaryIndex].geoObjects.remove(polygon1);

	myMap[secondaryIndex].geoObjects.add(polygon1);
	resizeMaps();
	updateUrls();
};

const getCookie = function() {
	const data = {};
	const hash2 = unescape($.cookie('Hash'));
	if(hash2) {
		const pair = (hash2).split('&');
		for(let i = 0; i < pair.length; i ++) {
			const param = pair[i].split('=');
			if(param[1]==='NaN'){
			}
			else{
				data[param[0]] = param[1];
			}
		}
	}
	return data;
};

const getHash = function() {
	const data = {};
	const hash2 = unescape(location.hash);
	if(hash2) {
		const pair = (hash2.substr(1)).split('&');
		for(let i = 0; i < pair.length; i ++) {
			const param = pair[i].split('=');
			if(param[1]==='NaN'){
			}
			else{
				data[param[0]] = param[1];
			}
		}
	}
	return data;
};

const loadHashToCookies=function(hash,cookies){
	for (const n in hash){
		if (hash[n]===undefined){
		}
		else{
			cookies[n]=hash[n];
		}
	}
};

const loadCookies=function(cookies){
	if (cookies['h']===undefined){
	}
	else{
		let horizontalDividerPercentage=Math.min(parseFloat(cookies['h']),0.99);
		horizontalDivider=horizontalDividerPercentage*$('#maps').width();
	}
	if (cookies['v']===undefined){
	}
	else{
		let verticalDividerPercentage=Math.min(parseFloat(cookies['v']),0.99);
		verticalDivider=verticalDividerPercentage*$('#maps').height();
	}
	if (cookies['o']===undefined){
	} else{
		orientation=cookies['o'];
		if (orientation==='vertical'){
			$('#horizontalDivider').hide();
			$('#verticalDivider').show();
		}
		else{
			orientation='horizontal';
			$('#horizontalDivider').show();
			$('#verticalDivider').hide();
		}
	}
	for (let i=0; i<2; i++){
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
				}
			}
		}

		if (cookies['A'+i]===undefined){
		}
		else{
			if (cookies['L'+i]===undefined){
			}
			else{
				const Alt = parseFloat(cookies['A' + i]);
				const Lon = parseFloat(cookies['L' + i]);
				myMap[i].setCenter([Alt,Lon]);
			}
		}


		if (cookies['a'+i]===undefined){
		} else {
			angle[i]=parseFloat(cookies['a'+i]);
		}
		if (cookies['Z'+i]===undefined){
		}
		else{
			myMap[i].setZoom(cookies['Z'+i]);
		}

		if (cookies['p'+i]===undefined){
		}
		else if (cookies['p'+i]===''){
		}
		else{
			const polygons = JSON.parse(cookies['p' + i]);
			if (polygons.length>0){
				myMap[i].geoObjects.each(function (geoObject) {
					geoObject.getMap().geoObjects.remove(geoObject);
					//polygonNumber=polygonNumber-1;
				});
			}
			for (let m in polygons){
				const geometry = polygons[m];
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

				}
			}
		}
	}
};

const saveCookies=function(){
	if ((location.hash==='#reset')||(location.hash==='#l=e')||(location.hash==='#l=r')){
	}
	else{
		$.cookie('Hash',makeHash(), { expires: 365, path: '/' });
	}
};

function onWindowResize (){
	mapsWidth=Math.max($('#maps').width(),1);
	mapsHeight=Math.max($('#maps').height(),1);
	const horizontalDividerPercentage=horizontalDivider/mapsWidth;
	const verticalDividerPercentage=verticalDivider/mapsHeight;
	horizontalDivider=mapsWidth*horizontalDividerPercentage;
	verticalDivider=mapsHeight*verticalDividerPercentage;
	resizeMaps();
}

function rotatePanesBoth(){
	rotatePanes(0);
	rotatePanes(1);
}

function rotatePanes(index) {
	return;
	let paneName;
	const degrees = '' + (angle[index]) + 'deg';
	const undegrees = '-' + (angle[index]) + 'deg';

	$('#map'+index+' .ymaps-2-1-76-inner-panes').rotate(degrees);
	for (paneName in whitePanesArray){
		$(myMap[index].panes.get(whitePanesArray[paneName]).getElement()).rotate(undegrees);
	}
	for (paneName in blackPanesArray){
		$('#map'+index+' .ymaps-'+YMver+'-'+blackPanesArray[paneName]+'-pane').rotate(undegrees);
		/*const pane = myMap[index].panes.get(blackPanesArray[paneName]);
		if (pane != null) {
			$(myMap[index].panes.get(blackPanesArray[paneName]).getElement()).rotate(undegrees);
		}*/
	}
	//$(myMap[mapNumber].panes.get('copyrights').getElement()).rotate(undegrees);
	//$('#map'+index+' .compass').rotate(degrees);
	//$('.handle'+index).rotate(degrees);
	//location.hash=makeHash();

}

function makeHash() {
	let params = {};


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
	let polygons = [];
	myMap[0].geoObjects.each(function (geoObject) {
		polygons.push(geoObject.geometry.getCoordinates());
	});
	let polygonsString = JSON.stringify(polygons);
	params['p0']=polygonsString;

	polygons = [];
	myMap[1].geoObjects.each(function (geoObject) {
		polygons.push(geoObject.geometry.getCoordinates());
	});
	polygonsString = JSON.stringify(polygons);
	params['p1']=polygonsString;

	let hash = '';
	for (const i in params){
		hash=hash+'&'+i+'='+params[i];
	}
	hash=hash.substr(1);


	return hash;
}

ymaps.ready(init);
