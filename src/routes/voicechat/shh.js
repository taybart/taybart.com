/* Polyfill EventEmitter. */
class EventEmitter {
  constructor () {
    this.events = {};
  }

  on(event, listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.removeListener(event, listener);
  }

  removeListener(event, listener) {
    if (typeof this.events[event] === 'object') {
      const index = this.events[event].indexOf(listener);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  };

  emit(event, ...args) {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => listener.apply(this, args));
    }
  };

  once(event, listener) {
    const remove = this.on(event, (...args) => {
      remove();
      listener.apply(this, args);
    });
  }
}


export default class Shh extends EventEmitter {
  static audioContext = null;
  constructor(stream, options = {}) {
    super();
    let audioContextType;
    if (typeof window !== 'undefined') {
      audioContextType = window.AudioContext || window.webkitAudioContext;
    }
    // make it not break in non-supported browsers
    if (!audioContextType) return;

    //Config
    this.smoothing = (options.smoothing || 0.1);
    this.interval = (options.interval || 50);
    this.threshold = options.threshold;
    const play = options.play;
    this.history = options.history || 10;
    this.running = true;

    // Ensure that just a single AudioContext is internally created
    this.audioContext = options.audioContext || this.audioContext || new audioContextType();


    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = this.smoothing;
    this.fftBins = new Float32Array(this.analyser.frequencyBinCount);

    if (stream.jquery) {
      stream = stream[0];
    }

    if (stream instanceof HTMLAudioElement || stream instanceof HTMLVideoElement) {
      // Audio Tag
      this.sourceNode = this.audioContext.createMediaElementSource(stream);
      if (typeof play === 'undefined') {
        this.play = true;
      }
      this.threshold = this.threshold || -50;
    } else {
      // WebRTC Stream
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      this.threshold = this.threshold || -50;
    }

    // this.sourceNode.connect(this.analyser);
    this.sourceNode.connect(this.analyser);
    if (play) {
      this.analyser.connect(this.audioContext.destination);
    }

    this.speaking = false;

    Object.defineProperty(this, 'state', {
      get: () => this.audioContext.state,
    });

    this.audioContext.onstatechange = () => {
      this.emit('state_change', this.audioContext.state);
    }


    this.speakingHistory = [];
    for (let i = 0; i < this.history; i++) {
      this.speakingHistory.push(0);
    }

    // Poll the analyser node to determine if speaking
    // and emit events if changed
    this.poll();
  }

  poll() {
    setTimeout(() => {
      //check if stop has been called
      if(!this.running) { return; }

      const currentVolume = this.getMaxVolume();

      this.emit('volume_change', currentVolume, this.threshold);

      let history = 0;

      if (currentVolume > this.threshold && !this.speaking) {
        for (let i = this.speakingHistory.length - 3; i < this.speakingHistory.length; i++) {
          history += this.speakingHistory[i];
        }
        if (history >= 2) {
          this.speaking = true;
          this.emit('speaking');
        }
      } else if (currentVolume < this.threshold && this.speaking) {
        for (let i = 0; i < this.speakingHistory.length; i++) {
          history += this.speakingHistory[i];
        }
        if (history === 0) {
          this.speaking = false;
          this.emit('stopped_speaking');
        }
      }
      this.speakingHistory.shift();
      this.speakingHistory.push(0 + (currentVolume > this.threshold));

      this.poll();
    }, this.interval);
  };

  suspend() {
    return this.audioContext.suspend();
  }
  resume() {
    return this.audioContext.resume();
  }

  stop() {
    this.running = false;
    this.emit('volume_change', -100, this.threshold);
    if (this.speaking) {
      this.speaking = false;
      this.emit('stopped_speaking');
    }
    this.analyser.disconnect();
    this.sourceNode.disconnect();
  }

  setThreshold(t) {
    this.threshold = t;
  }

  setInterval(i) {
    this.interval = i;
  }

  getMaxVolume() {
    let maxVolume = -Infinity;
    this.analyser.getFloatFrequencyData(this.fftBins);
    for(let i = 4; i < this.fftBins.length; i++) {
      if (this.fftBins[i] > maxVolume && this.fftBins[i] < 0) {
        maxVolume = this.fftBins[i];
      }
    }
    return maxVolume;
  }
}

