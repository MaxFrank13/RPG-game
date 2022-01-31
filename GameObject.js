class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "images/characters/people/hero.png"
    })

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

  }
  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // if we have behavior, kick off a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)

  }
  update() {

  }

  async doBehaviorEvent(map) {

    // stop function if cutscene is playing or config is empty
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }

    // setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // create an event instance out of our event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // setting the next even to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }
}