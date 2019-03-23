var config = {
  apiKey: "AIzaSyD0Ox0KsT757nYrMSENHUGwXNn1gSkfeqU",
  authDomain: "project-one-aff90.firebaseapp.com",
  databaseURL: "https://project-one-aff90.firebaseio.com",
  projectId: "project-one-aff90",
  storageBucket: "project-one-aff90.appspot.com",
  messagingSenderId: "303504563350"
};
firebase.initializeApp(config);
const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");
//window.addEventListener('load', function() {
  //document.querySelector('input[type="file"]').addEventListener('change', function() {
    //  if (this.files && this.files[0]) {
      //    var img = document.querySelector('img');  // $('img')[0]
        //  img.src = URL.createObjectURL(this.files[0]); // set src to file url
          //img.onload = imageIsLoaded; // optional onload event listener
      //}
  //});
//});
var cloudinary_URL = 'https://api.cloudinary.com/v1_1/monger/image/upload';
var cloudinary_Upload_Preset = 'vh0ycmva';
document.getElementById('real-file').addEventListener("change",uploadImage,false   )

function uploadImage(event){
  var file= event.target.files[0]; 
  console.log('file',file);
  var formData= new FormData();
  formData.append('file',file);
  formData.append('upload_preset',cloudinary_Upload_Preset);
  axios({
    url:cloudinary_URL,
    method:'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data:formData
    })
    .then(function(res) {
    console.log('this is response',res);
    }).catch(function(err){
console.log(err);
});
}
var image = "";
        var latLonTime = [];
        //gets lat lon time from current image in carousel
        $('#myCarousel').on('slid.bs.carousel', function () { //slid.bs.carousel is triggered after current image loads in carousel
            image = $("div.active > img");
            console.log("carousel image: ", image);
            getLatLonTime(image[0]);
          })
      //get latLonTime from clicked image ***does not work on carousel images***
        $("img").click(function(){
            getLatLonTime(this);
            console.log("clicked latLonTime",latLonTime); 
        });
        //get latLonTime from clicked image ***does not work on carousel images***
        function getLatLonTime(imgElement) {
            EXIF.getData(imgElement, function() {
                myData = imgElement;
                //console.log(myData.exifdata);
                //document.getElementById('pic-info').innerHTML = 'This photo was taken on ' + myData.exifdata.DateTime + ' with a ' + myData.exifdata.Make + ' ' + myData.exifdata.Model;
                
                // Calculate latitude decimal
                var latDegree = myData.exifdata.GPSLatitude[0].numerator;
                var latMinute = myData.exifdata.GPSLatitude[1].numerator;
                var latSecond = myData.exifdata.GPSLatitude[2].numerator;
                var latDirection = myData.exifdata.GPSLatitudeRef;
                
                var latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);
                //console.log(latFinal);
                // Calculate longitude decimal
                var lonDegree = myData.exifdata.GPSLongitude[0].numerator;
                var lonMinute = myData.exifdata.GPSLongitude[1].numerator;
                var lonSecond = myData.exifdata.GPSLongitude[2].numerator;
                var lonDirection = myData.exifdata.GPSLongitudeRef;
                var lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
                //console.log(lonFinal);
               // document.getElementById('map-link').innerHTML = '<a href="http://www.google.com/maps/place/'+latFinal+','+lonFinal+'" target="_blank">Google Maps</a>';
            });
        }
        function ConvertDMSToDD(degrees, minutes, seconds, direction) {
            
            var dd = degrees + (minutes/60) + (seconds/3600);
            
            if (direction == "S" || direction == "W") {
                dd = dd * -1; 
            }
            
            return dd;
        }