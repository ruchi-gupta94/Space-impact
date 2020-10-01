//Global variables
var lifeValue = 3;
var gameState;
var score = 0;
var car,carImage;
var ground,groundImage, invisibleGround;
var bg, bgImg;
var life,lifeImage1,lifeImage2, lifeImage3;
var fireGroup, fireImage1,fireImage2;
var skyGroup, birdImage, cloudImage; 

function preload(){
  //load images        
  carImage = loadImage("car.png");
  groundImage = loadImage("ground.png");
  
  bgImage = loadAnimation("bg1.png","bg2.png","bg3.png","bg4.png","bg5.png","bg6.png","bg7.png");
  fireImage1 = loadImage("fire1.png");
  fireImage2 = loadImage("fire2.png");
  
  birdImage = loadImage("crow.png");
  cloudImage = loadImage("cloud.png");
  
  lifeImage1 = loadImage("life_1.png");
  lifeImage2 = loadImage("life_2.png");
  lifeImage3 = loadImage("life_3.png");
  //Load sound
  jumpSound = loadSound('jump.mp3');
  carHitSound = loadSound('die.mp3');
  lifeSound = loadSound('score.mp3');
}

function setup(){
  createCanvas(700, 400);
  gameState = "start";
  //Car object properties
  car = createSprite(70, 360, 40, 30);
  car.addImage(carImage);
  car.scale = 0.2;
  car.setCollider("circle",0,-55,180);
  //Ground object propperties
  ground = createSprite(800,380,700,20);
  ground.addImage(groundImage);
  invisibleGround = createSprite(350,395,700,30);
  //background properties
  bg = createSprite(400,200,700,400);
  bg.addAnimation("loading",bgImage);
  bg.scale = 0.5 ;
  bg.animation.looping=false;
  bg.animation.frameDelay=16;
  //life properties
  life= createSprite(580,20,10,10);
  life.addImage("life3",lifeImage3);
  life.addImage("life2",lifeImage2);
  life.addImage("life1",lifeImage1);
  life.scale = 0.2;
   //group
  fireGroup = new Group();
  skyGroup = new Group();
  //Visiblity property
  life.visible = false;
  car.visible= false;
  ground.visible = false;
  invisibleGround.visible = false;
}

function draw(){
  background(255);
  var edges = createEdgeSprites();
   //Hide the loading images 
  if(mousePressedOver(bg) && gameState==="start"){
    bg.visible = false;
    car.visible = true;
    ground.visible = true;
    life.visible = true;
    gameState="play";
  }
  //Condition for play state
  if(gameState ==="play"){  
    score = Math.round(World.frameCount/4);
    displayScore();
    createFire();
    createSky();
    fireGroup.collide(invisibleGround);
    ground.velocityX =-6;
    //When car touches the fire
    if(fireGroup.isTouching(car)){
       //update life
      updateLife();
   }
    if(ground.x<0){
      ground.x = ground.width/2;
    }
    //Move up
    if((keyDown("space")||(keyDown("up")))&&car.y>350){
      car.setVelocity(0,-12); 
      jumpSound.play();
    }
    //move right
    if(keyDown("RIGHT"))
      car.x = car.x+6;
    //move left
    if(keyDown("Left"))
       car.x = car.x-6;
    
    //Adding gravity
    car.setVelocity(0,car.velocityY+ 0.3);
    
  }
  //End state
  if(gameState ==="end"){
    displayScore();
    car.setVelocity(0,0);
    fireGroup.setLifetimeEach(-1);
    skyGroup.setLifetimeEach(-1);            
    fireGroup.setVelocityEach(0,0);
    skyGroup.setVelocityEach(0,0);
    ground.setVelocity(0,0);
    textSize(30);
    fill("black");
    text("Game Over!", 250,200);
  }
  car.bounceOff(edges[0]);
  car.bounceOff(edges[1]);
  car.collide(invisibleGround);
  drawSprites();
}

function createFire(){
  //Create fire for each count
  if (frameCount % 50 === 0) {
    var fire = createSprite(895, 200, 20,20);
    fire.addImage("fire1",fireImage1);
    fire.addImage("fire2",fireImage2);
    
    var rand = Math.round(random(1,2));
    
    if(rand===1)
      fire.changeImage("fire1");
    else if(rand===2)
      fire.changeImage("fire2");
    
    fire.scale= 0.08;
    fire.velocityX = random(-8,-1);
    fire.lifetime = 550;
    fire.velocityY = random(1,7);
    car.depth = fire.depth+1;
    fireGroup.add(fire);
  }
}

function createSky(){
  if (frameCount % 60 === 0) {
    var sky = createSprite(895, 200, 20,20);
    sky.addImage("crow",birdImage);
    sky.lifetime = 550; 
    sky.addImage("cloud",cloudImage);
    sky.y = random(200,300);
    var rand = Math.round(random(1,2));
    
    if(rand===1){
      sky.changeImage("cloud");
      sky.scale= 0.5;
    }
    else if(rand===2){
      sky.changeImage("crow");
      sky.scale= 0.08;
    }
    
    car.depth = sky.depth+1;
    sky.velocityX = -3;
    skyGroup.add(sky);
  }
}

function displayScore(){
  textSize(20);
  textFont("georgia");
  fill("black");
  text("Score: "+score, 550, 80);
}

function updateLife(){
  fireGroup.destroyEach(); 
  lifeValue--;
  //Update life value
  if(lifeValue<=0){
    life.visible = false;
    carHitSound.play();
    gameState="end";
  }
  else if(lifeValue===2){ 
    life.changeImage("life2");
    life.scale= 0.18;
    carHitSound.play();
  }
  else if(lifeValue===1){
    life.changeImage("life1");
    life.scale= 0.1;
    carHitSound.play();
  }
  else{
    life.changeImage("life3");
    life.scale= 0.1;
    lifeSound.play();
  }
  car.x = 100;
}