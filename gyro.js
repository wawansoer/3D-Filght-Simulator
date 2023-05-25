// Gyro related
if(window.DeviceOrientationEvent){
    // For iOS13: Is there a function that asks the user for permission to access?
    if(DeviceOrientationEvent.requestPermission){
        var sensor_contents= document.getElementById("sensor_contents");
        // when an element with id="sensor_contents" is clicked
        sensor_contents.addEventListener("click", function(){
            // Request permission for gyro sensor
            DeviceOrientationEvent.requestPermission().then(function(response){
                // if the request is granted
                if(response === "granted"){
                    // deviceorientation is enabled
                }
            }).catch(function(e){
                console.log(e);
            });
                  
        });
    // Other than iOS13
    }else{
       // do nothing
    }
  }
  // gyro processing
  
  let gyroData = {
    "x":0,
    "y":0,
    "z":0
  }
  
  addEventListener("deviceorientation", (event) => {
    gyroData.x = event.alpha;
    gyroData.y = event.gamma;
    gyroData.z = event.alpha;
  
  }, true);
  
  
  
  function ctrWithGyro() {
    aircraft.elevator = 0;
    const a = Math.PI/4;
    if (Math.abs(gyroData.x) > a) {
      if (gyroData.x > a) {
        aircraft.elevator = 1;
      }else{
        aircraft.elevator = -1;
      }
    }else{
      aircraft.elevator = gyroData.x/a;
    }
  }