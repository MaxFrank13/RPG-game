class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
      )
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects(){
    Object.keys(this.gameObjects).forEach(key => {
      
      let object = this.gameObjects[key];
      object.id = key;
      // TODO: determine if object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // start loop of events
    // await each one
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // reset NPCs to idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    })
    console.log({ match })
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x,y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "images/maps/DemoLower.png",
    upperSrc: "images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6)
      }),
      npc1: new Person({
        isPlayerControlled: false,
        x: utils.withGrid(6),
        y: utils.withGrid(8),
        src: "images/characters/people/npc1.png",
        behaviorLoop: [
            { type: "stand", direction: "left", time: 800 },
            { type: "stand", direction: "up", time: 1800 },
            { type: "stand", direction: "right", time: 1200 },
            { type: "stand", direction: "up", time: 2300 },
        ]
      }),
      npc2: new Person({
        isPlayerControlled: false,
        x: utils.withGrid(3),
        y: utils.withGrid(7),
        src: "images/characters/people/npc2.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "up", time: 600 },
          { type: "stand", direction: "left", time: 1500 },
          { type: "stand", direction: "right", time: 1500 },
          { type: "stand", direction: "down", time: 1300 },

        ]
      })
    },
    walls: {
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(8,7)] : true
    }
  }
}