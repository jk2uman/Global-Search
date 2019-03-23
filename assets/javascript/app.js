// firebase code section

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyD0Ox0KsT757nYrMSENHUGwXNn1gSkfeqU',
  authDomain: 'project-one-aff90.firebaseapp.com',
  databaseURL: 'https://project-one-aff90.firebaseio.com',
  projectId: 'project-one-aff90',
  storageBucket: 'project-one-aff90.appspot.com',
  messagingSenderId: '303504563350'
};
firebase.initializeApp(config);

var database = firebase.database();

$('#img-upload').hide();

var getCarousalImages = function() {
  database.ref('/most_viewed_photos').on(
    'value',
    function(snapshot) {
      $('.image-gallery .row').empty();

      $.each(snapshot.val(), function(i, value) {
        console.log('snapshot.val() is', snapshot.val());

        var markup =
          '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"><div class="card"><img id="img-upload" class="card-img-top" src="' +
          value.secure_url +
          '" alt="' +
          value.original_filename +
          '"><div class="card-body"><h5 class="card-title">Card title</h5><p class="card-text"></p><a href="#" class="btn btn-primary">Go somewhere</a></div></div></div>';

        $('.image-gallery .row').append(markup);
      });
    },
    function(errorObject) {
      showNotification(errorObject.code, 'danger');
    }
  );
};

getCarousalImages();

// upload form code section
$('.upload-btn').on('click', function() {
  // on file upload -> show image
  // check if checkbox is checked -> send to cloudinary
  var cloudinary_URL = 'https://api.cloudinary.com/v1_1/monger/image/upload';
  var cloudinary_Upload_Preset = 'vh0ycmva';
  var file = $('#img-input')[0].files[0];
  // getMapData($('#img-input')[0]);

  readURL($('#img-input')[0]);

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $('#img-upload')
          .attr('src', e.target.result)
          .fadeIn('slow');
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  // send photo to cloudinary if the user checked the checkbox
  if ($('#upload-checkbox').is(':checked')) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinary_Upload_Preset);
    axios({
      url: cloudinary_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    })
      .then(function(res) {
        console.log('repsonse', res);

        var newImage = {
          url: res.data.url,
          secure_url: res.data.secure_url,
          original_filename: res.data.original_filename
        };

        database
          .ref('/most_viewed_photos')
          .push(newImage)
          .then(function() {
            $('.message')
              .text('Your photo is uploaded to our server')
              .fadeIn('slow')
              .delay(2000)
              .fadeOut('slow');
          })
          .catch(function(error) {
            $('.message')
              .text(error)
              .fadeIn('slow')
              .delay(2000)
              .fadeOut('slow');
          });
      })

      .catch(function(err) {
        console.log(err);
      });
  }
});

// on image click
$(document).on('click', '#img-upload', function(e) {
  EXIF.getData(this, function() {
    myData = this;

    console.log(myData.exifdata);

    // Calculate latitude decimal
    var latDegree = myData.exifdata.GPSLatitude[0].numerator;
    var latMinute = myData.exifdata.GPSLatitude[1].numerator;
    var latSecond = myData.exifdata.GPSLatitude[2].numerator;
    var latDirection = myData.exifdata.GPSLatitudeRef;

    var latFinal = ConvertDMSToDD(
      latDegree,
      latMinute,
      latSecond,
      latDirection
    );
    console.log(latFinal);

    // Calculate longitude decimal
    var lonDegree = myData.exifdata.GPSLongitude[0].numerator;
    var lonMinute = myData.exifdata.GPSLongitude[1].numerator;
    var lonSecond = myData.exifdata.GPSLongitude[2].numerator;
    var lonDirection = myData.exifdata.GPSLongitudeRef;

    var lonFinal = ConvertDMSToDD(
      lonDegree,
      lonMinute,
      lonSecond,
      lonDirection
    );
    console.log(lonFinal);

    $('.image-details')
      .text(
        'This photo was taken on ' +
          myData.exifdata.DateTime +
          ' with a ' +
          myData.exifdata.Make +
          ' ' +
          myData.exifdata.Model
      )
      .fadeIn('slow')
      .delay(3000)
      .fadeOut('slow');

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat: 40.731, lng: -73.997 }
    });

    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();

    // pin the location on the map
    geocodeLatLng(geocoder, map, infowindow, latFinal, lonFinal);
  });
});

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / 3600;
  if (direction == 'S' || direction == 'W') {
    dd = dd * -1;
  }
  return dd;
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: { lat: 40.731, lng: -73.997 }
  });
}

function geocodeLatLng(geocoder, map, infowindow, latFinal, lonFinal) {
  var latlng = {
    lat: latFinal,
    lng: lonFinal
  };
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
