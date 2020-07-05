import Oscillator from "./Oscillator";
import {Controller, GUI} from "dat.gui";

export default class Synth {
  context: AudioContext = undefined;
  oscs: Oscillator[] = [];
  audio: GainNode = undefined;
  lowpassFilter: BiquadFilterNode = undefined;
  highpassFilter: BiquadFilterNode = undefined;
  #muteRef: Controller;

  get lowpass() {
    return this.lowpassFilter.frequency.value;
  }
  set lowpass(val) {
    this.lowpassFilter.frequency.value = val;
  }
  get lowpassQ() {
    return this.lowpassFilter.Q.value;
  }
  set lowpassQ(val) {
    this.lowpassFilter.Q.value = val;
  }
  get highpass() {
    return this.highpassFilter.frequency.value;
  }
  set highpass(val) {
    this.highpassFilter.frequency.value = val;
  }
  get highpassQ() {
    return this.highpassFilter.Q.value;
  }
  set highpassQ(val) {
    this.highpassFilter.Q.value = val;
  }

  constructor() {
    this.context = new AudioContext();
    this.audio = this.context.createGain();
    this.lowpassFilter = this.context.createBiquadFilter();
    this.highpassFilter = this.context.createBiquadFilter();
    this.lowpassFilter.type = "lowpass";
    this.highpassFilter.type = "highpass";
    this.audio.connect(this.lowpassFilter);
    this.lowpassFilter.connect(this.highpassFilter);
    this.highpassFilter.connect(this.context.destination);
  }

  setupInterface(gui: GUI) {
    let masterFolder = gui.addFolder('Master');
    let lowpassFolder = masterFolder.addFolder('Lowpass');
    lowpassFolder.add(this, 'lowpass', 0, 2000);
    lowpassFolder.add(this, 'lowpassQ', 0, 10);
    let highpassFolder = masterFolder.addFolder('Highpass');
    highpassFolder.add(this, 'highpass', 0, 2000);
    highpassFolder.add(this, 'highpassQ', 0, 10);
    this.#muteRef = masterFolder.add(this, 'mute');
  }

  addOscillator(freq = 440): Oscillator {
    const osc = new Oscillator(this, freq);
    this.oscs.push(osc);
    return osc;
  }

  mute() {
    this.audio.gain.value = 0;
    this.#muteRef.name('unmute');
    this.#muteRef.property = 'unmute';
  }

  unmute() {
    this.audio.gain.value = 1;
    this.#muteRef.name('mute');
    this.#muteRef.property = 'mute';
  }

  deleteOscillator(osc: Oscillator) {
    osc.stop();
    this.oscs.splice(this.oscs.indexOf(osc), 1);
  }
}
