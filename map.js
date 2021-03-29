am4core.ready(function () {
  const btnPos = document.querySelector('#getPos');
  const message = document.querySelector('.message');
  let geoData = null;
  /** id: 'US',
      name: 'United States', */
  const displayData = function (data) {
    geoData = data;
    const { country_code, country_name, city, ip } = data;
    message.innerHTML = `<div class="datainfo">
    <div class="header">Your Information </div><br/>
   <span class="first"> CODE: </span><span class="second">${country_code}</span>
   <span class="first">COUNTRY: </span><span class="second">${country_name}</span>
   <span class="first">City: </span><span class="second">${city}</span>
   <span class="first">IP:</span><span class="second"> ${ip}</span>
    </div>
    `;
  };

  // Add some data

  const whereAmI = function () {
    message.classList.remove('hide');
    message.innerHTML = 'Getting Position...';
    btnPos.classList.add('hide');
    fetch('https://freegeoip.app/json/')
      .then(data => data.json())
      .then(data1 => {
        displayData(data1);

        imageSeries.data = [
          {
            title: `${data1.city}, ip: ${data1.ip}`,
            latitude: data1.latitude,
            longitude: data1.longitude,
            color: colorSet.next(),
          },
          // {
          //   title: 'Copenhagen',
          //   latitude: 55.6763,
          //   longitude: 12.5681,
          //   color: colorSet.next(),
          // },
        ];
      });
  };

  btnPos.addEventListener('click', whereAmI);

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create map instance
  var chart = am4core.create('map', am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_worldLow;

  // Set projection
  chart.projection = new am4maps.projections.Miller();

  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = '{name}';
  polygonTemplate.polygon.fillOpacity = 0.6;

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create('hover');
  hs.properties.fill = am4core.color('#367B25');

  // // Remove Antarctica
  // polygonSeries.include = ['CR'];

  // Remove Antarctica
  polygonSeries.exclude = ['AQ'];
  // polygonSeries.include = ['CR', 'US'];
  // getData.then(geoData, err => console.log('error ', err));
  polygonSeries.data = [
    {
      id: 'US',
      name: 'United States',
      value: 100,
      // fill: am4core.color('#F05C5C'),
    },
    {
      id: 'CR',
      name: 'Costa Rica',
      value: 50,
      fill: am4core.color('#5C5CFF'),
    },
  ];

  chart.deltaLatitude = 9.9333;
  polygonTemplate.propertyFields.fill = 'fill';

  // Add image series
  var imageSeries = chart.series.push(new am4maps.MapImageSeries());
  imageSeries.mapImages.template.propertyFields.longitude = 'longitude';
  imageSeries.mapImages.template.propertyFields.latitude = 'latitude';
  imageSeries.mapImages.template.tooltipText = '{title}';
  imageSeries.mapImages.template.propertyFields.url = 'url';
  var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
  circle.radius = 3;
  circle.propertyFields.fill = 'color';

  function animateBullet(circle) {
    var animation = circle.animate(
      [
        { property: 'scale', from: 1, to: 5 },
        { property: 'opacity', from: 1, to: 0 },
      ],
      1000,
      am4core.ease.circleOut
    );
    animation.events.on('animationended', function (event) {
      animateBullet(event.target.object);
    });
  }

  var colorSet = new am4core.ColorSet();
}); // end am4core.ready()
