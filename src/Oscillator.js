import Synth from "./Synth";

export default class Oscillator {
  #osc: OscillatorNode = undefined;
  #gain: GainNode = undefined;

  get frequency() {
    return this.#osc.frequency.value;
  }
  set frequency(val) {
    this.#osc.frequency.value = val;
  }
  get gain() {
    return this.#gain.gain.value * 4;
  }
  set gain(val) {
    this.#gain.gain.value = val / 4;
  }
  get type() {
    return this.#osc.type;
  }
  set type(val) {
    this.#osc.type = val;
  }

  constructor(synth: Synth, frequency: number) {
    this.#osc = synth.context.createOscillator();
    this.#gain = synth.context.createGain();
    console.log({frequency});
    this.#osc.frequency.value = frequency;
    this.#gain.gain.value = 0.05;
    this.#osc.connect(this.#gain);
    this.#gain.connect(synth.audio);
    this.#osc.start();
  }

  stop() {
    this.#osc.stop();
  }
}
