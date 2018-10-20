//implementation of basic ray-tracer
//still working on it

//config
var config = {
  width: 800,
  height: 800
};

//init
var c = document.getElementById("canvas");
c.width = config.width;
c.height = config.height;
var ctx = c.getContext("2d");
var img_data = ctx.getImageData(0, 0, c.width, c.height);
var scene_objs = [];


//convert from x-y coordinates on canvas to the index of
//that pixel in canvas buffer.
function conv(x, y){
  return 4 * (y * c.width + x);
}

//x, y = the coordinates of the pixel
//col (r, g, b) = the values of RGB channels each in range [0, 255]
function putPixel(x, y, col){
  var ind = conv(x, y);

  img_data.data[ind] = col.x;
  img_data.data[ind + 1] = col.y;
  img_data.data[ind + 2] = col.z;
  img_data.data[ind + 3] = 255;
}

//Make matrix of dimensions n * m
function makeMatrix(n, m){
  var ret = new Array(n);
  for(let i = 0; i < n; ++i){
    ret[i] = new Array(m);
  }
  return ret;
}

//Class for 3D vectors
function Vec3(x, y, z){
  this.x = x;
  this.y = y;
  this.z = z;

  this.len2 = function(){
    return dot(this, this);
  }
  this.len = function(){
    return Math.sqrt(this.len2());
  }
}

function add(a, b){
  return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function sub(a, b){
  return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function dot(a, b){
  return a.x * b.x + a.y * b.y + a.z * b.z;  
}

function cross(a, b){
  return new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

//Class for the sphere
function Sphere(pos, r, color){
  this.pos = pos;
  this.r = r;
  this.color = color;
  this.intersection = function(p, d){
    var tmp = sub(p, this.pos);
    var a = dot(d, d);
    var b = dot(tmp, d) * 2;
    var c = dot(tmp, tmp) - this.r * this.r;
    var sols = solveQuadraticEquation(a, b, c);
    var ret = -1;
    for(let i = 0; i < sols.length; ++i){
      if(sols[i] > 1 && (ret == -1 || sols[i] < ret)){
        ret = sols[i]
      }
    }
    return ret;
  }
}

//returns the array of the solutions for the equation of the form ax^2 + bx + c = 0
function solveQuadraticEquation(a, b, c){
  var det = b * b - 4 * a * c;
  if(det > 0){
    return [(-b + Math.sqrt(det)) / (2 * a), (-b - Math.sqrt(det)) / (2 * a)];
  }
  else if (det == 0){
    return [-b / (2 * a)];
  }
  else {
    return []
  }
}

//Inits scene with objects
function initScene(){
  scene_objs.push(new Sphere(new Vec3(0, -1, 3), 1, new Vec3(255, 0, 0)));
  scene_objs.push(new Sphere(new Vec3(2, 0, 4), 1, new Vec3(0, 0, 255)));
  scene_objs.push(new Sphere(new Vec3(-2, 0, 4), 1, new Vec3(0, 255, 0)));
}

//x and y are given in *canvas* coordinates. 
function determineColorOfPixel(x, y){
  var s_x = x - c.width / 2;
  var s_y = -y + c.height / 2;
  var v_x = s_x / c.width;
  var v_y = s_y / c.height;
  var v_z = 1;

  var ray_vect = new Vec3(v_x, v_y, v_z);
  var origin = new Vec3(0, 0, 0);
  var pixel_dist = Infinity; // the minimal distance at which ray collides with some object
  var pixel_color = new Vec3(255, 255, 255); // if the ray doesn't hit anything the color is white
  var tmp;
  for(let i = 0; i < scene_objs.length; ++i){
    tmp = scene_objs[i].intersection(origin, ray_vect);
    if(tmp != -1 && tmp < pixel_dist){
      pixel_dist = tmp;
      pixel_color = scene_objs[i].color;
    }
  } 
  return pixel_color;
}

//draws scene
function drawScene(){
  for(let i = 0; i < c.height; ++i){
    for(let j = 0; j < c.width; ++j){
      putPixel(i, j, determineColorOfPixel(i, j));
    }
  }
  ctx.putImageData(img_data, 0, 0);
}

function main(){
  initScene();
  drawScene();
}

main();

