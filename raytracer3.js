//implementation of basic ray-tracer
// + diffuse shading

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
var scene_lights = [];

var LIGHT_TYPE = Object.freeze({
  "ambient": 0,
  "point": 1,
  "directional": 2});

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

//Class for 3D vectors
class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.len2 = function () {
      return dot(this, this);
    };
    this.len = function () {
      return Math.sqrt(this.len2());
    };
    this.scale = function (c) {
      return new Vec3(c * this.x, c * this.y, c * this.z);
    };
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
class Sphere {
<<<<<<< HEAD
  constructor(pos, r, color) {
    this.pos = pos;
    this.r = r;
    this.color = color;
=======
  constructor(pos, r, color, specular) {
    this.pos = pos;
    this.r = r;
    this.color = color;
    this.specular = specular;
>>>>>>> 802a279b4f28ef83c45c09a4e3b052ba043bce04
    this.intersection = function (p, d) {
      var tmp = sub(p, this.pos);
      var a = dot(d, d);
      var b = dot(tmp, d) * 2;
      var c = dot(tmp, tmp) - this.r * this.r;
      var sols = solveQuadraticEquation(a, b, c);
      var ret = -1;
      for (let i = 0; i < sols.length; ++i) {
        if (sols[i] > 1 && (ret == -1 || sols[i] < ret)) {
          ret = sols[i];
        }
      }
      return ret;
    };
  }
}

//class for the light objects
class Light {
  constructor(type, intensity, pos) {
    this.type = type;
    this.intensity = intensity;
    this.pos = pos; // in the directional case it is direction vector
    this.calc_intensity = function (n, p, s = -1) {
      var final_intensity = 0;
      var tmp;
      if (this.type == LIGHT_TYPE.ambient) {
        final_intensity = this.intensity;
      }
      else {
        //diffuse
        var l = (this.type == LIGHT_TYPE.directional ? this.pos : sub(this.pos, p));
        tmp = dot(n, l);
        if (tmp > 0)
          final_intensity += this.intensity * tmp / l.len();
        //specular
        if (s != -1) {
          var r = sub(n.scale(2 * dot(n, l)), l);
          var v = p.scale(-1);
          tmp = dot(r, v);
          if (tmp > 0)
            final_intensity += this.intensity * Math.pow(tmp / (r.len() * v.len()), s);
        }
      }
      return final_intensity;
    };
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
    return [];
  }
}

//Inits scene with objects
function initScene(){
<<<<<<< HEAD
  scene_objs.push(new Sphere(new Vec3(0, -1, 3), 1, new Vec3(255, 0, 0)));
  scene_objs.push(new Sphere(new Vec3(2, 0, 4), 1, new Vec3(0, 0, 255)));
  scene_objs.push(new Sphere(new Vec3(-2, 0, 4), 1, new Vec3(0, 255, 0)));
  scene_objs.push(new Sphere(new Vec3(0, -5001, 0), 5000, new Vec3(255, 255, 0)));
=======
  scene_objs.push(new Sphere(
    new Vec3(0, -1, 3), 
    1, 
    new Vec3(255, 0, 0), 
    500));
  scene_objs.push(new Sphere(
    new Vec3(2, 0, 4), 
    1, 
    new Vec3(0, 0, 255),
    500));
  scene_objs.push(new Sphere(
    new Vec3(-2, 0, 4), 
    1, 
    new Vec3(0, 255, 0),
    10));
  scene_objs.push(new Sphere(
    new Vec3(0, -5001, 0), 
    5000, 
    new Vec3(255, 255, 0),
    1000));
>>>>>>> 802a279b4f28ef83c45c09a4e3b052ba043bce04

  scene_lights.push(new Light(LIGHT_TYPE.ambient, 0.2));
  scene_lights.push(new Light(LIGHT_TYPE.point, 0.6, new Vec3(2, 1, 0)));
  scene_lights.push(new Light(LIGHT_TYPE.directional, 0.2, new Vec3(1, 4, 4)));
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
  var closest_obj_id = -1;
  var pixel_dist = Infinity; // the minimal distance at which ray collides with some object
  var tmp;
  for(let i = 0; i < scene_objs.length; ++i){
    tmp = scene_objs[i].intersection(origin, ray_vect);
    if(tmp != -1 && tmp < pixel_dist){
      pixel_dist = tmp;
      closest_obj_id = i;
    }
  } 
  if(closest_obj_id == -1){
    return new Vec3(255, 255, 255);
  }
  var collision_point = add(origin, ray_vect.scale(pixel_dist));
  var normal_vec = sub(collision_point, scene_objs[closest_obj_id].pos);
<<<<<<< HEAD
  normal_vec.scale(1 / normal_vec.len()); //normalize to unit length
  var total_intensity = 0;
  for(let i = 0; i < scene_lights.length; ++i){
    total_intensity += scene_lights[i].calc_diffuse_intensity(normal_vec, collision_point);
=======
  normal_vec = normal_vec.scale(1 / normal_vec.len()); //normalize to unit length
  var total_intensity = 0;
  for(let i = 0; i < scene_lights.length; ++i){
    total_intensity += scene_lights[i].calc_intensity(
      normal_vec, 
      collision_point, 
      scene_objs[closest_obj_id].specular);
>>>>>>> 802a279b4f28ef83c45c09a4e3b052ba043bce04
  }
  return scene_objs[closest_obj_id].color.scale(total_intensity);
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

