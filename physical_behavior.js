function aircraftPB() {
    //thrust and drag
    let thrust = aircraft.throttle*6;
    let drag = {
      "x":aircraft.speed.x/10,
      "y":aircraft.speed.y/10,
      "z":aircraft.speed.z/10
    }
  
    //lift
    let dirOfMov = {"x":aircraft.speed.x, "y":aircraft.speed.y, "z":aircraft.speed.z}
    let length = Math.sqrt(dirOfMov.x**2 + dirOfMov.y **2 + dirOfMov.z ** 2);
    dirOfMov.x /= length;
    dirOfMov.y /= length;
    dirOfMov.z /= length;
    const pitchCos = ((dirOfMov.z)/(Math.sqrt(dirOfMov.x**2+dirOfMov.y**2+dirOfMov.z**2)))
    const pitch = dirOfMov.y > 0 ? -Math.acos(pitchCos) : Math.acos(pitchCos);
    aircraft.pitch = pitch * 180/Math.PI;
    let lift = aircraft.speed.z * aircraft.speed.z * pitch;
    if (Math.abs(pitch) > Math.PI/4) {
      lift = 0;
    }
    
    
  
  
    let upwardForce = 0;
  
    //gravity
    const vec = rotate(aircraft.axis, {"x":0,"y":-1,"z":0}, -aircraft.rad);
    
    const weight = {
      "under":6.1 * -vec.y,
      "right":6.1 * vec.x,
      "front":6.1 * vec.z,
    };
    aircraft.weight = weight;
    
    upwardForce = lift - weight.under;
    upwardForce = upwardForce - drag.y;
    upwardForce *= 0.1;
    if (!aircraft.landingFlag) {
      thrust += weight.front;
    }
  
    aircraft.speed.z += (thrust - drag.z)/20;
    aircraft.speed.y += upwardForce/20;
    aircraft.speed.x += (weight.right - aircraft.speed.x)/20;
    
    // landing process
    aircraft.landingFlag = false;
    if (aircraft.y <= 10) {
      let shock = 0;
      shock -= rotate(aircraft.axis,aircraft.speed,aircraft.rad).y;
      if (shock < 5) {
        aircraft.y = 10;
        aircraft.landingFlag = true;
        let newVec = rotate(aircraft.axis,aircraft.speed,aircraft.rad);
        if (newVec.y < 0) {
          newVec.y = 0;
        }
        newVec = rotate(aircraft.axis,newVec,-aircraft.rad);
        aircraft.speed = newVec;
      }else{
        aircraft.exploded = true;
      }
    }
    if (aircraft.landingFlag) {
      const localZAxis = getLocalZAxis(aircraft.axis, aircraft.rad);
      let rad1 = Math.atan(localZAxis.y/Math.sqrt(localZAxis.x**2+localZAxis.z**2));
  
      if (rotate(aircraft.axis,{"x":0,"y":0,"z":1},aircraft.rad).y < -0.05 || aircraft.speed.z < 3 || aircraft.elevator !== -1) {
        aircraft.rotationSpeed.x = -rad1/50;
      }else{
        let elevLift = aircraft.speed.z * aircraft.elevator / 10000;
        if (aircraft.speed.z < 3) {elevLift = 0};
        aircraft.rotationSpeed.x += (-(aircraft.speed.y/10000)-(elevLift) - aircraft.rotationSpeed.x)/20;
      }
  
      const localXAxis = getLocalXAxis(aircraft.axis, aircraft.rad);
      let rad2 = Math.atan(localXAxis.y/Math.sqrt(localXAxis.x**2+localXAxis.z**2));
  
      aircraft.rotationSpeed.z = rad2/20;
    }
    // Oblique landing explosion detection
    {
      const localXAxis = getLocalXAxis(aircraft.axis, aircraft.rad);
      let rad2 = Math.atan(localXAxis.y/Math.sqrt(localXAxis.x**2+localXAxis.z**2));
      if (aircraft.y < 70 && (Math.abs(rad2) > Math.PI/6  || getLocalYAxis(aircraft.axis,aircraft.rad).y < 0)) {
        aircraft.exploded = true;
      }
    }
  
    //move(front)
    let localZAxis = getLocalZAxis(aircraft.axis, aircraft.rad);
    aircraft.x += localZAxis.x * aircraft.speed.z;
    aircraft.y += localZAxis.y * aircraft.speed.z;
    aircraft.z += localZAxis.z * aircraft.speed.z;
  
    // move (vertical)
    let localYAxis = getLocalYAxis(aircraft.axis, aircraft.rad);
    aircraft.x += localYAxis.x * aircraft.speed.y;
    aircraft.y += localYAxis.y * aircraft.speed.y;
    aircraft.z += localYAxis.z * aircraft.speed.y;
  
    // move (horizontal)
    let localXAxis = getLocalXAxis(aircraft.axis, aircraft.rad);
    aircraft.x += localXAxis.x * aircraft.speed.x;
    aircraft.y += localXAxis.y * aircraft.speed.x;
    aircraft.z += localXAxis.z * aircraft.speed.x;
    
    
  
    // rotate
    // Return the quaternion to the axis and angle (calculate the cross product (make a quaternion (local y-axis, 0.01), make a quaternion (current axis, current angle)))
    // elevator
    if (!aircraft.landingFlag) {
      let elevLift = aircraft.speed.z * aircraft.elevator / 4000;
      if (aircraft.speed.z < 3) {elevLift = 0};
      aircraft.rotationSpeed.x += (-(aircraft.speed.y/10000)-(elevLift) - aircraft.rotationSpeed.x)/20;
    }
    if (aircraft.rad !== 0 || aircraft.rotationSpeed.x !== 0) {
      let newAxisAndRad = returnToAxisAndRad(calcQuaternion(makeQuaternion(getLocalXAxis(aircraft.axis, aircraft.rad), -aircraft.rotationSpeed.x), makeQuaternion(aircraft.axis, aircraft.rad)));
      aircraft.axis = newAxisAndRad[0];
      aircraft.rad = newAxisAndRad[1];
    }
  
    // ladder
    let rudderLift = aircraft.speed.z * aircraft.rudder / 8000;
    aircraft.rotationSpeed.y += (-(aircraft.speed.x/10000)-(rudderLift) - aircraft.rotationSpeed.y)/20;
    if (aircraft.rad !== 0 || aircraft.rotationSpeed.y !== 0) {
      let newAxisAndRad = returnToAxisAndRad(calcQuaternion(makeQuaternion(getLocalYAxis(aircraft.axis, aircraft.rad), -aircraft.rotationSpeed.y), makeQuaternion(aircraft.axis, aircraft.rad)));
      aircraft.axis = newAxisAndRad[0];
      aircraft.rad = newAxisAndRad[1];
    }
  
    // aileron
    if (!aircraft.landingFlag) {
      let aileronLift = aircraft.speed.z * aircraft.aileron / 2500;
      aircraft.rotationSpeed.z += (-(aileronLift) - aircraft.rotationSpeed.z)/20;
    }
    if (aircraft.rad !== 0 || aircraft.rotationSpeed.z !== 0) {
      let newAxisAndRad = returnToAxisAndRad(calcQuaternion(makeQuaternion(getLocalZAxis(aircraft.axis, aircraft.rad), -aircraft.rotationSpeed.z), makeQuaternion(aircraft.axis, aircraft.rad)));
      aircraft.axis = newAxisAndRad[0];
      aircraft.rad = newAxisAndRad[1];
    }
  }