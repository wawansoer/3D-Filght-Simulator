class Quaternion {
    constructor() {
      this.w = 0;
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
  }
  
  class Vector {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
  }
  
  function makeQuaternion(vector,rad) {
    let result = new Quaternion();
    let length;
  
    length = Math.sqrt(vector.x**2 + vector.y**2 + vector.z**2);
    let normalVec = new Vector();
    normalVec.x = vector.x/length;
    normalVec.y = vector.y/length;
    normalVec.z = vector.z/length;
    
    let halfSin = Math.sin(rad/2);
    let halfCos = Math.cos(rad/2);
  
    result.w = halfCos;
    result.x = normalVec.x * halfSin;
    result.y = normalVec.y * halfSin;
    result.z = normalVec.z * halfSin;
  
    return result;
  }
  
  function returnToAxisAndRad(q) {
    let axis = new Vector();
    let rad;
    let halfRad = Math.acos(q.w);
    let halfSin = Math.sin(halfRad);
    if (q.w === 1) {
      axis.x = q.x;
      axis.y = q.y;
      axis.z = q.z;
    }else{
      axis.x = q.x/halfSin;
      axis.y = q.y/halfSin;
      axis.z = q.z/halfSin;
    }
    rad = halfRad*2;
    return [axis,rad];
  }
    
  function calcQuaternion(q1,q2) {
    let result = new Quaternion();
    let num;
    num = q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z;
    result.w = num;
    num = q1.w*q2.x + q1.x*q2.w + q1.y*q2.z - q1.z*q2.y;
    result.x = num;
    num = q1.w*q2.y - q1.x*q2.z + q1.y*q2.w + q1.z*q2.x;
    result.y = num;
    num = q1.w*q2.z + q1.x*q2.y - q1.y*q2.x + q1.z*q2.w;
    result.z = num;
  
    return result;
  }
  
  function rotate(axis,pos,rad) {
    let axisQuat = makeQuaternion(axis,rad);
    let posQuat = new Quaternion();
    posQuat.x = pos.x;
    posQuat.y = pos.y;
    posQuat.z = pos.z;
    /*if (Math.abs(rad) < 0.00001) {
      let result = new Vector();
      result.x = pos.x;
      result.y = pos.y;
      result.z = pos.z;
      return result;
    }else*/{
      let resultQuat;
      let result = new Vector();
    
      let conjugate = new Quaternion();
      conjugate.w = axisQuat.w;
      conjugate.x = -axisQuat.x;
      conjugate.y = -axisQuat.y;
      conjugate.z = -axisQuat.z;
    
      resultQuat = calcQuaternion(axisQuat,posQuat);
      resultQuat = calcQuaternion(resultQuat,conjugate);
    
      result.x = resultQuat.x;
      result.y = resultQuat.y;
      result.z = resultQuat.z;
    
      return result;
    }
  }
  
  function synthOfRotation(q1,q2) {
    return calcQuaternion(q2,q1);
  }
  
  function vectorProduct(v1,v2) {
    let result = new Vector();
    result.x = v1.y*v2.z - v1.z*v2.y;
    result.y = v1.z*v2.x - v1.x*v2.z;
    result.z = v1.x*v2.y - v1.y*v2.x;
    return result;
  }
  
  function getLocalYAxis(axis,rad) {
    return rotate(axis,{"x":0,"y":1,"z":0},rad);
  }
  
  function getLocalXAxis(axis,rad) {
    return rotate(axis,{"x":1,"y":0,"z":0},rad);
  }
  
  function getLocalZAxis(axis,rad) {
    return rotate(axis,{"x":0,"y":0,"z":1},rad);
  }