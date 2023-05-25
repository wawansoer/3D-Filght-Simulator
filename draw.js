function drawGround1() {
    let object = ground;
    // Convert to relative coordinates as seen from the camera
    let relativeVertexes = [];
    for(let j = 0; j < object.vertexes.length; j++) {
      let vertex = Object.assign({},object.vertexes[j]);
      vertex.x -= cam.x;
      vertex.y -= cam.y;
      vertex.z -= cam.z;
      vertex = rotate(cam.axis,vertex,-cam.rad);
      relativeVertexes.push(vertex);
    }
    //draw
    
    for (let j = 0; j < object.faces.length; j++) {
      ctx.beginPath();
      let began = false;
      
      for (let k = 0; k < object.faces[j].length; k++) {
        let p1;
        let p2;
        if (k === (object.faces[j].length-1)) {
          p1 = Object.assign({},relativeVertexes[object.faces[j][k]]);
          p2 = Object.assign({},relativeVertexes[object.faces[j][0]]);
        }else{
          p1 = Object.assign({},relativeVertexes[object.faces[j][k]]);
          p2 = Object.assign({},relativeVertexes[object.faces[j][k+1]]);
        }
        if (p1.z < 10 && p2.z > 10) {
          p1.x += (p2.x-p1.x)*(10-p1.z)/(p2.z-p1.z);
          p1.y += (p2.y-p1.y)*(10-p1.z)/(p2.z-p1.z);
          p1.z = 10;
        }else if (p1.z > 10 && p2.z < 10) {
          p2.x += (p1.x-p2.x)*(10-p2.z)/(p1.z-p2.z);
          p2.y += (p1.y-p2.y)*(10-p2.z)/(p1.z-p2.z);
          p2.z = 10;
        }
        
        if (p1.z > 0 && p2.z > 0) {
          let screenP1 = {"x":p1.x*800/p1.z, "y":p1.y*800/p1.z}
          let screenP2 = {"x":p2.x*800/p2.z, "y":p2.y*800/p2.z}
          if (!began) {
            ctx.moveTo(screenP1.x,-screenP1.y);
            began = true;
          }else{
            ctx.lineTo(screenP1.x,-screenP1.y);
          }
          ctx.lineTo(screenP2.x,-screenP2.y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = "#669D34";
      ctx.lineWidth = 0.5;
      ctx.fill();
    }
  }
  
  function drawGround2() {
    let relativeVertexes = [];
    for (let i = -30000; i < 30000; i += 500) {
      let vertex1 = {"x":cam.x+i-((cam.x+200000000)%500),
                     "y":0,
                     "z":cam.z+Math.sqrt(30000**2 - (i)**2)};
      vertex1.x -= cam.x;
      vertex1.y -= cam.y;
      vertex1.z -= cam.z;
      vertex1 = rotate(cam.axis,vertex1,-cam.rad);
      relativeVertexes.push(vertex1);
      
      let vertex2 = {"x":cam.x+i-((cam.x+200000000)%500),
                     "y":0,
                     "z":cam.z-Math.sqrt(30000**2 - (i)**2)};
      vertex2.x -= cam.x;
      vertex2.y -= cam.y;
      vertex2.z -= cam.z;
      vertex2 = rotate(cam.axis,vertex2,-cam.rad);
      relativeVertexes.push(vertex2);
    }
    let polygons = [];
    for (let i = 0; i < 119; i++) {
      if ((i+Math.floor(cam.x/500))%2 === 0) {
        polygons.push([i*2, (i+1)*2, (i+1)*2+1, "#96D35F"]);
        polygons.push([(i+1)*2+1, i*2+1, i*2, "#96D35F"]);
      }
    }
  
    let startI = polygons.length/2;
    for (let i = -30000; i < 30000; i += 500) {
      let vertex1 = {"z":cam.z+i-((cam.z+200000000)%500),
                     "y":0,
                     "x":cam.x+Math.sqrt(30000**2 - (i)**2)};
      vertex1.x -= cam.x;
      vertex1.y -= cam.y;
      vertex1.z -= cam.z;
      vertex1 = rotate(cam.axis,vertex1,-cam.rad);
      relativeVertexes.push(vertex1);
      
      let vertex2 = {"z":cam.z+i-((cam.z+200000000)%500),
                     "y":0,
                     "x":cam.x-Math.sqrt(30000**2 - (i)**2)};
      vertex2.x -= cam.x;
      vertex2.y -= cam.y;
      vertex2.z -= cam.z;
      vertex2 = rotate(cam.axis,vertex2,-cam.rad);
      relativeVertexes.push(vertex2);
    }
    for (let i = 120; i < 239; i++) {
      if ((i+Math.floor(cam.z/500))%2 === 0) {
        polygons.push([i*2, (i+1)*2, (i+1)*2+1, "#96D35F"]);
        polygons.push([(i+1)*2+1, i*2+1, i*2, "#96D35F"]);
      }
    }
  
    //draw
    ctx.beginPath();
    let startingPoint = {"x":"nan","y":0};
    for (let i = 0; i < polygons.length; i++) {
      let polygon = polygons[i];
      let began = false;
      for (let j = 0; j < 3; j++) {
        let p1;
        let p2;
        if (j === 2) {
          p1 = Object.assign({},relativeVertexes[polygon[2]]);
          p2 = Object.assign({},relativeVertexes[polygon[0]]);
        }else{
          p1 = Object.assign({},relativeVertexes[polygon[j]]);
          p2 = Object.assign({},relativeVertexes[polygon[j+1]]);
        }
        if (p1.z < 10 && p2.z > 10) {
          p1.x += (p2.x-p1.x)*(10-p1.z)/(p2.z-p1.z);
          p1.y += (p2.y-p1.y)*(10-p1.z)/(p2.z-p1.z);
          p1.z = 10;
        }else if (p1.z > 10 && p2.z < 10) {
          p2.x += (p1.x-p2.x)*(10-p2.z)/(p1.z-p2.z);
          p2.y += (p1.y-p2.y)*(10-p2.z)/(p1.z-p2.z);
          p2.z = 10;
        }
        if (p1.z > 0 && p2.z > 0) {
          let screenP1 = {"x":p1.x*800/p1.z, "y":p1.y*800/p1.z}
          let screenP2 = {"x":p2.x*800/p2.z, "y":p2.y*800/p2.z}
          if (!began) {
            ctx.moveTo(screenP1.x,-screenP1.y);
            if (startingPoint.x === "nan") {
              startingPoint.x = screenP1.x;
              startingPoint.y = screenP1.y;
            }
            began = true;
          }else{
            ctx.lineTo(screenP1.x,-screenP1.y);
          }
          ctx.lineTo(screenP2.x,-screenP2.y);
        }
      }
    }
    ctx.moveTo(startingPoint.x,-startingPoint.y);
    ctx.lineTo(startingPoint.x+0.01,-startingPoint.y+0.01);
    ctx.lineTo(startingPoint.x+0.01,-startingPoint.y-0.01);
    ctx.fillStyle = "#96D35F";
    ctx.fill("evenodd");
  }
  
  function draw() {
    ctx.clearRect(-400,-(300),800,600);
    ctx.fillStyle = "#93E3FD";
    ctx.fillRect(-400,-(300),800,600);
  
    drawGround1();
    drawGround2();
    
    let relativeVertexes = [];
    let polygons = [];
    let arrToSort = [];
    
    for(let i = 0; i < objects.length; i++) {
      if (objects[i].visible) {
        // keep the number from the vertex list
        let nowObjIdx = relativeVertexes.length;
        // Add vertices (relative coordinates) to the list one by one
        let object = objects[i];
        for(let j = 0; j < object.vertexes.length; j++) {
          let vertex = Object.assign({},object.vertexes[j]);
          vertex.x -= cam.x;
          vertex.y -= cam.y;
          vertex.z -= cam.z;
          vertex = rotate(cam.axis,vertex,-cam.rad);
          relativeVertexes.push(vertex);
        }
        // Add polygon (or point) information to the list one by one
        for (let j = 0; j < object.faces.length; j++) {
          if (object.faces.length > 3) {
            //polygon
            const p1 = relativeVertexes[nowObjIdx+object.faces[j][0]];
            const p2 = relativeVertexes[nowObjIdx+object.faces[j][1]];
            const p3 = relativeVertexes[nowObjIdx+object.faces[j][2]];
            // Then we pretend not to add polygons that are facing backwards
            const sightVec = {"x":p1.x,"y":p1.y,"z":p1.z};
            const hors = vectorProduct({"x":p2.x-p1.x,"y":p2.y-p1.y,"z":p2.z-p1.z},
                                      {"x":p3.x-p1.x,"y":p3.y-p1.y,"z":p3.z-p1.z})//Vector growing on the table
            const cos = (sightVec.x*hors.x+sightVec.y*hors.y+sightVec.z*hors.z)/(Math.sqrt(sightVec.x**2+sightVec.y**2+sightVec.z**2)*Math.sqrt(hors.x**2+hors.y**2+hors.z**2));
            if (cos < 0) {
              // z for ordering
              let z;
              if (cos > -0.707) {
                z = (10 * Math.max(p1.z,p2.z,p3.z) + (p1.z+p2.z+p3.z)/3)/11;
              }else{
                z = (p1.z+p2.z+p3.z)/3;
              }
              // light and dark
              const lightVec = rotate(cam.axis,{"x":-1,"y":-5,"z":-1},-cam.rad);
              const cos2 = (lightVec.x*hors.x+lightVec.y*hors.y+lightVec.z*hors.z)/(Math.sqrt(lightVec.x**2+lightVec.y**2+lightVec.z**2)*Math.sqrt(hors.x**2+hors.y**2+hors.z**2));
              const coef = 0.875-cos2/8;
              //const color = object.faces[j][3];
              const oc = getRGB(object.faces[j][3]);//original color
              const color = "rgb("+(oc.r*coef)+","+(oc.g*coef)+","+(oc.b*coef)+")";
              //addition
              polygons.push([nowObjIdx+object.faces[j][0], nowObjIdx+object.faces[j][1], nowObjIdx+object.faces[j][2], z, color]);
              arrToSort.push([-z,polygons.length-1]);
            }
          }else{
            //point
            const p = relativeVertexes[nowObjIdx+object.faces[j][0]];
            polygons.push([nowObjIdx+object.faces[j][0], object.faces[j][1], p.z, object.faces[j][2]]);
            arrToSort.push([-p.z,polygons.length-1]);
          }
          
        }
      }
    }
    arrToSort = sort(arrToSort);
    //draw
    for (let i = 0; i < polygons.length; i++) {
      let polygon = polygons[arrToSort[i][1]];
      if (polygon.length > 4) {
        //polygon
        let began = false;
        ctx.beginPath();
        for (let j = 0; j < 3; j++) {
          let p1;
          let p2;
          if (j === 2) {
            p1 = Object.assign({},relativeVertexes[polygon[2]]);
            p2 = Object.assign({},relativeVertexes[polygon[0]]);
          }else{
            p1 = Object.assign({},relativeVertexes[polygon[j]]);
            p2 = Object.assign({},relativeVertexes[polygon[j+1]]);
          }
          if (p1.z < 10 && p2.z > 10) {
            p1.x += (p2.x-p1.x)*(10-p1.z)/(p2.z-p1.z);
            p1.y += (p2.y-p1.y)*(10-p1.z)/(p2.z-p1.z);
            p1.z = 10;
          }else if (p1.z > 10 && p2.z < 10) {
            p2.x += (p1.x-p2.x)*(10-p2.z)/(p1.z-p2.z);
            p2.y += (p1.y-p2.y)*(10-p2.z)/(p1.z-p2.z);
            p2.z = 10;
          }
          if (p1.z > 0 && p2.z > 0) {
            let screenP1 = {"x":p1.x*800/p1.z, "y":p1.y*800/p1.z}
            let screenP2 = {"x":p2.x*800/p2.z, "y":p2.y*800/p2.z}
            if (!began) {
              ctx.moveTo(screenP1.x,-screenP1.y);
              began = true;
            }else{
              ctx.lineTo(screenP1.x,-screenP1.y);
            }
            ctx.lineTo(screenP2.x,-screenP2.y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = polygon[4];
        ctx.strokeStyle = polygon[4];
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }else{
        //point
        ctx.beginPath();
        const p = Object.assign({},relativeVertexes[polygon[0]]);
        if (p.z > 10) {      
          let screenP = {"x":p.x*800/p.z, "y":p.y*800/p.z}
          ctx.moveTo(screenP.x,-screenP.y);
          ctx.arc(screenP.x, -screenP.y, polygon[1]*800/p.z, 0, 2*Math.PI)
          ctx.fillStyle = polygon[3];
          ctx.fill();
        }
      }
    }
    //Various data
    drawMiniMap();
    ctx.font = "20px serif";
    ctx.fillStyle = "black";
    ctx.fillText("speed: "+ Math.round(aircraft.speed.z), -350, -(200));
    ctx.fillText("y: "+ Math.round(aircraft.y), -350, -(150));
    ctx.fillText("throttle: "+ Math.round(aircraft.throttle*100)/100, -350, -(100));
  }
  
  function drawMiniMap() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(-370,-(-120),150,150);
    ctx.strokeRect(-370,-(-120),150,150);
    //-370 to -220,-120 to -270
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-295,-(-120));
    ctx.lineTo(-295,-(-270));
    ctx.moveTo(-370,-(-195));
    ctx.lineTo(-220,-(-195));
    ctx.stroke();
    let targetsOnMap = [];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      let relTarget = {"x":target.x-aircraft.x, "y":target.y-aircraft.y, "z":target.z-aircraft.z};
      relTarget = rotate(aircraft.axis,relTarget,-aircraft.rad);
      targetsOnMap.push({"x":relTarget.x,"z":relTarget.z});
    }
    ctx.fillStyle = "white";
    for(let i = 0; i < targetsOnMap.length; i++) {
      const pos = targetsOnMap[i];
      if (pos.z > 15000 && Math.abs(pos.x) < pos.z) {
        // sticking out above
        pos.x = pos.x * (15000/pos.z);
        pos.z = 15000;
      }else if (pos.z < -15000 && Math.abs(pos.x) < -pos.z) {
        // sticking out below
        pos.x = pos.x * (-15000/pos.z);
        pos.z = -15000;
      }else if (pos.x < -15000 && Math.abs(pos.z) < -pos.x) {
        // protrudes to the left
        pos.z = pos.z * (-15000/pos.x);
        pos.x = -15000;
      }else if (pos.x > 15000 && Math.abs(pos.z) < pos.x) {
        // protruding to the right
        pos.z = pos.z * (15000/pos.x);
        pos.x = 15000;
      }
      ctx.fillRect(-295+(pos.x*0.005)-2.5,-(-195+(pos.z*0.005)+2.5),5,5);
    }
  }
  
  function drawGameOver() {
    ctx.clearRect(-400,-(300),800,600);
    ctx.fillStyle = "#93E3FD";
    ctx.fillRect(-400,-(300),800,600);
    
    ctx.font = "50px serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center"
    ctx.fillText("YOU CRASHED", 0, -(0));
  }
  
  
  function sort(arr) {
    if (arr.length < 2) {
      return arr;
    }
  
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle);
  
    return merge(sort(left), sort(right));
  }
  
  function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;
  
    while (i < left.length && j < right.length) {
      if (left[i][0] < right[j][0]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
  
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
  
  function getRGB(colorCode) {
    const split = colorCode.split("");
    const r = parseInt(split[1]+split[2],16);
    const g = parseInt(split[3]+split[4],16);
    const b = parseInt(split[5]+split[6],16);
    return {"r":r,"g":g,"b":b};
  }