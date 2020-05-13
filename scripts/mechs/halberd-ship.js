const elib = require("effectlib");
const plib = require("plib");

const halberdBullet = extend(BasicBulletType, {});
halberdBullet.damage = 12;
halberdBullet.bulletWidth = 6;
halberdBullet.bulletHeight = 12;
halberdBullet.speed = 9;
halberdBullet.lifetime = 18;
halberdBullet.frontColor = plib.frontColorCyan;
halberdBullet.backColor = plib.backColorCyan;
halberdBullet.hitEffect = Fx.hitBulletSmall;
halberdBullet.shootEffect = Fx.shootBig;
halberdBullet.smokeEffect = Fx.shootBigSmoke;

const halberdBullet2 = extend(BasicBulletType, {
  update(b){
    Effects.effect(this.trailEffect, b.x, b.y, b.rot());
    if(Mathf.chance(0.1)){
      var cone = this.lightningCone;
      var rot = b.rot() + Mathf.random(-cone, cone);
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.lancerLaser, this.lightningDamage, b.x, b.y, rot, 10);
    }
  },
  hit(b, x, y){},
  despawned(b){
    this.super$despawned(b);
    for(var i = 0; i < 3; i++){
      Calls.createLighting(b.id + Mathf.random(50), b.getTeam(), Pal.lancerLaser, this.lightningDamage, b.x, b.y, Mathf.random(360), 15);
    }
  }
});
halberdBullet2.lightningDamage = 12
halberdBullet2.lightningCone = 45;
halberdBullet2.damage = 0;
halberdBullet2.pierce = true;
halberdBullet2.speed = 7;
halberdBullet2.drag = 0.05;
halberdBullet2.lifetime = 60;
halberdBullet2.hitEffect = Fx.none;
halberdBullet2.shootEffect = Fx.shootBig;
halberdBullet2.smokeEffect = Fx.shootBigSmoke;
halberdBullet2.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, Mathf.lerp(6, 0.2, e.fin()));
});
halberdBullet2.hitEffect = Fx.none;
halberdBullet2.despawnEffect = newEffect(20, e => {
  elib.outlineCircle(e.x, e.y, Pal.lancerLaser, e.fout() * 6, 1 + e.fin() * 14);
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 0.2 + e.fout() * 0.8, Mathf.lerp(12, 0.2, e.fin()));
});

const halberdGun = extendContent(Weapon, "gatling", {
  load(){
    this.region = Core.atlas.find(modName + "-gatling-equip");
  }
});
halberdGun.length = 1.2;
halberdGun.reload = 6;
halberdGun.alternate = true;
halberdGun.inaccuracy = 1;
halberdGun.ejectEffect = Fx.shellEjectSmall;
halberdGun.shootSound = Sounds.shootBig;
halberdGun.bullet = halberdBullet;

const halberd = extendContent(Mech, "halberd-ship", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
  },
  updateAlt(player){
    this.vec2.trns(player.rotation - 90, 0, this.engineOffset);
    Effects.effect(this.halberdTrail(player),
      player.x + this.vec2.x + (player.velocity().x * 5 / 6),
      player.y + this.vec2.y + (player.velocity().y * 5 / 6),
      player.rotation
    );
    if(Mathf.chance((player.velocity().len() / this.maxSpeed * 0.08))){
      this.vec2.trns(player.rotation - 90, 0, this.weaponOffsetY);
      var dir = player.rotation - 90 + Mathf.random(-this.plasmaCone, this.plasmaCone);
      Calls.createBullet(halberdBullet2, player.getTeam(),
        player.x + this.vec2.x, player.y + this.vec2.y,
        dir, 1, 1
      );
    }
  },
  halberdTrail: function(player){
    return newEffect(30, e => {
      var size = e.fout() * 1.5 * this.engineSize * (player.velocity().len() / this.maxSpeed);
      elib.fillCircle(e.x, e.y, this.engineColor, 1, size);
    });
  }
});
halberd.plasmaCone = 30;
halberd.vec2 = new Vec2();
halberd.flying = true;
halberd.drillPower = 4;
halberd.mineSpeed = 1.4;
halberd.speed = 0.2;
halberd.maxSpeed = 15;
halberd.drag = 0.01;
halberd.mass = 4;
halberd.health = 420; // WEED
halberd.itemCapacity = 80;
halberd.engineColor = plib.frontColorCyan;
halberd.cellTrnsY = 1;
halberd.buildPower = 1.2;
halberd.weapon = halberdGun;

const halberdPad = extendContent(MechPad, "halberd-ship-pad", {});
halberdPad.mech = halberd;
