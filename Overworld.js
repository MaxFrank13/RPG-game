class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // establish the camera
      const cameraPerson = this.map.gameObjects.hero;

      // update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map
        })
      })
      // draw lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // draw game object layer
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })
      
      // draw upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // do the NPCs have anything to say
      this.map.checkForActionCutscene();
    })
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    this.bindActionInput();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      { who: "hero", type: "walk", direction: "down" },
      { who: "hero", type: "walk", direction: "down" },
      { who: "hero", type: "walk", direction: "down" },
      { who: "npc1", type: "walk", direction: "left" },
      { who: "npc1", type: "stand", direction: "down", time:400 },
      { who: "hero", type: "stand", direction: "up", time:800 },
      { who: "npc2", type: "walk", direction: "down", time:400 },
      { who: "npc2", type: "walk", direction: "down", time:200 },
      { who: "npc2", type: "walk", direction: "right"},
      { who: "hero", type: "stand", direction: "left", time: 400},
      { type: 'textMessage', text: "Why, hello there!"}
    ])
  }
}