// Yoinked from three js website
class InputManager {
  constructor() {
    this.keys = {};
    const keyMap = new Map();
 
    const setKey = (keyName, pressed) => {
      const keyState = this.keys[keyName];
      keyState.justPressed = pressed && !keyState.down;
      keyState.down = pressed;
    };
 
    const addKey = (keyCode, name) => {
      this.keys[name] = { down: false, justPressed: false };
      keyMap.set(keyCode, name);
    };
 
    const setKeyFromKeyCode = (keyCode, pressed) => {
      const keyName = keyMap.get(keyCode);
      if (!keyName) {
        return;
      }
      setKey(keyName, pressed);
    };
 
    // Arrow keys
    addKey(37, 'left');
    addKey(39, 'right');
    addKey(38, 'up');
    addKey(40, 'down');

    // action keys
    addKey(90, 'z');       // Z key - FIRE
    addKey(88, 'x');       // X key - SWITCH
    addKey(89, 'y');       // Y key - PARRY
    addKey(17, 'ctrl');    // Control key - BOMB
    addKey(32, 'space');   // Spacebar - PAUSE
 
    window.addEventListener('keydown', (e) => {
      setKeyFromKeyCode(e.keyCode, true);
    });
    window.addEventListener('keyup', (e) => {
      setKeyFromKeyCode(e.keyCode, false);
    });
  }
  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}