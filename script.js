let ctx = document.getElementById("main").getContext("2d");
ctx.translate(400, 300);

let cam = {
  "axis": { "x": 0, "y": 1, "z": 0 },
  "rad": 0,
  "x": 0,
  "y": 40,
  "z": 0
}

let objects = [];

let coolTime = 15;

let gyroMode = false;

class Vertex {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

let ground = new Ground();
let bullets = [];
let targets = [];
let blasts = [];
//objects.push(new Island());
//objects.push(new Tree(0, 110, -300));
targets.push(new Target(0, 500, 25600));
objects.push(targets[0]);
//objects.push(new Cloud(0, 10000, 10000));
let aircraft = new Aircraft(0, 1000, 0);
//objects.push(new Cube(0,100,800,60));
//objects.push(new Aircraft2(0,100,800));
objects.push(aircraft);

//draw();


function mainLoop() {

  if (gyroMode) {
    ctrWithGyro();
  }else{
    if (key.e) {
      aircraft.rudder = 1;
    }else if (key.q) {
      aircraft.rudder = -1;
    }else{
      aircraft.rudder = 0;
    }
    if (key.a) {
      aircraft.aileron = 1;
    }else if (key.d) {
      aircraft.aileron = -1;
    }else{
      aircraft.aileron = 0;
    }
    if (key.w) {
      aircraft.elevator = 1;
    }else if (key.s) {
      aircraft.elevator = -1;
    }else{
      aircraft.elevator = 0;
    }
    
    if (key.i) {
      if (aircraft.throttle < 1) {
        aircraft.throttle += 0.01;
      }
    }
    if (key.k) {
      if (aircraft.throttle > 0) {
        aircraft.throttle -= 0.01;
      }
    }
  }
   
  aircraftPB();

  if (!aircraft.exploded) {
    if (coolTime > 0) {
      coolTime--;
    }
    if (key.j && coolTime <= 0) {
      let vec = getLocalZAxis(aircraft.axis,aircraft.rad);
      vec.x *= 100;
      vec.y *= 100;
      vec.z *= 100;
      let add = rotate(aircraft.axis,aircraft.speed,aircraft.rad);
      vec.x += add.x;
      vec.y += add.y;
      vec.z += add.z;
      bullets.push(new Bullet(aircraft.x, aircraft.y, aircraft.z, vec));
      objects.push(bullets[bullets.length-1]);
      coolTime = 10;
    }
    
    aircraft.update();
    aircraft.recentPosture.shift();
    aircraft.recentPosture.push([aircraft.axis, aircraft.rad]);
    let newCamPos = rotate(aircraft.recentPosture[0][0], { "x": 0, "y": 50, "z": -300 }, aircraft.recentPosture[0][1]);
    cam.x = aircraft.x + newCamPos.x;
    cam.y = aircraft.y + newCamPos.y;
    if (cam.y < 10) {
      cam.y = 10;
    }
    cam.z = aircraft.z + newCamPos.z;
    cam.axis = aircraft.recentPosture[0][0];
    cam.rad = aircraft.recentPosture[0][1];
    
    ground.update();
  
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].x += bullets[i].vec.x;
      bullets[i].y += bullets[i].vec.y;
      bullets[i].z += bullets[i].vec.z;
      bullets[i].vertexes = [];
      bullets[i].vertexes.push(new Vertex(bullets[i].x,bullets[i].y,bullets[i].z));
      let relX = bullets[i].x-aircraft.x;
      let relY = bullets[i].y-aircraft.y;
      let relZ = bullets[i].z-aircraft.z;
      // judging from the ground and distance
      if (Math.sqrt(relX**2+relY**2+relZ**2) > 30000 || bullets[i].y < 3) {
        bullets[i].dead = true;
        bullets.splice(i,1);
        i--;
      }else{
        for (let j = 0; j < targets.length; j++) {
          relX = bullets[i].x-targets[j].x;
          relY = bullets[i].y-targets[j].y;
          relZ = bullets[i].z-targets[j].z;
          if (Math.sqrt(relX**2+relY**2+relZ**2) < 400) {
            for (let k = 0; k < 20; k++) {
              blasts.push(new Blast(targets[j].x,targets[j].y,targets[j].z,400,70));
              objects.push(blasts[blasts.length-1]);
            }
            targets[j].dead = true;
            targets.splice(j,1);
            j--;
            bullets[i].dead = true;
            bullets.splice(i,1);
            i--;
  
            targets.push(new Target(aircraft.x+rndInt(-20000,20000), rndInt(1000,3000), aircraft.z+rndInt(-10000,10000)));
            objects.push(targets[targets.length-1]);
            break;
          }
        }
      }
    }
  
    for (let i = 0; i < blasts.length; i++) {
      let blast = blasts[i];
      blast.prog += 0.02;
      if (blast.prog <= 1) {
        blast.x = blast.center.x + (blast.vec.x * (1-(1-blast.prog)**2));
        blast.y = blast.center.y + (blast.vec.y * (1-(1-blast.prog)**2));
        blast.z = blast.center.z + (blast.vec.z * (1-(1-blast.prog)**2));
        const size = blast.size * ((1-blast.prog)**2);
        blast.vertexes = [];
        blast.vertexes.push(new Vertex(blast.x,blast.y,blast.z));
        blast.faces = [];
        blast.faces.push([0,size,"#FF0000"])
      }
      
      if (blast.prog > 1 || blast.y < 10) {
        blast.dead = true;
        blasts.splice(i,1);
        i--;
      }
    }
    
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].dead) {
        objects.splice(i,1);
        i--;
        break;
      }
      
      let relX = objects[i].x-aircraft.x;
      let relY = objects[i].y-aircraft.y;
      let relZ = objects[i].z-aircraft.z;
      // judging from the ground and distance
      if (Math.sqrt(relX**2+relY**2+relZ**2) < 30000 || objects[i].visible === "ground") {
        objects[i].visible = true;
      }else{
        objects[i].visible = false;
      }
    }
    
    draw();
    requestAnimationFrame(mainLoop);
  }else{
    drawGameOver();
  }

}

mainLoop();


function rndInt(min,max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min;
}