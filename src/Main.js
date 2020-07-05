import * as dat from 'dat.gui';
import {GUI} from 'dat.gui';
import Synth from "./Synth";

export default class Main {

  #gui: GUI = undefined;
  #synth: Synth = undefined;
  #controllers: any = {};

  constructor() {
    this.#gui = new dat.GUI({autoPlace: false});
    document.getElementById('synth').appendChild(this.#gui.domElement);
    this.#controllers.start = this.#gui.add({
      Start: () => {
        this.start()
      }
    }, 'Start');
  }

  start() {
    this.#synth = new Synth();
    this.#gui.remove(this.#controllers.start);
    this.#controllers.start = undefined;
    this.#setupSynthGUI();
  }

  #setupSynthGUI() {
    this.#gui.add({
      'Add Oscillator': () => {
        this.addOscillator()
      }
    }, 'Add Oscillator');
    this.#synth.setupInterface(this.#gui);
  }

  addOscillator() {
    const controllers = {};
    const oscillator = this.#synth.addOscillator();

    controllers.folder = this.#gui.addFolder(`Oscillator ${this.#synth.oscs.length}`);
    controllers.frequency = controllers.folder.add(oscillator, 'frequency', 100, 2000);
    controllers.gain = controllers.folder.add(oscillator, 'gain', 0, 1);
    controllers.type = controllers.folder.add(oscillator, 'type', ["sawtooth", "sine", "square", "triangle"]);
    controllers.delete = controllers.folder.add({
      'delete': () => {
        this.#synth.deleteOscillator(oscillator);
        controllers.folder.remove(controllers.frequency);
        controllers.folder.remove(controllers.gain);
        controllers.folder.remove(controllers.type);
        controllers.folder.remove(controllers.delete);
        this.#gui.removeFolder(controllers.folder);
      }
    }, 'delete');
  }

  get isStarted() {
    return this.#synth !== undefined;
  }
}
