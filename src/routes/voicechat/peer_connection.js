import 'webrtc-adapter';
import Shh from './shh.js';

export default class PeerConnection  extends RTCPeerConnection {
  constructor(id, target, signaling, stream, onConnect, onClose, onDisconnect) {
    super({
      iceServers: [
        {
          urls: "turn:142.93.82.98:3478",
          username: "taylor",
          credential: "ne8667DZTf7L9tn",
        },
        { urls: "stun:142.93.82.98:3478", }
      ]
    })
    this.id = id;
    this.target = target;
    this.signaling = signaling
    this.stream = stream;

    this.onConnect = onConnect || (() => {});
    this.onClose = onClose || (() => {});
    this.onDisconnect = onDisconnect || (() => {});

    console.log('Adding Local Stream to peer connection');
    this.stream.getAudioTracks().forEach(track => this.addTrack(track, this.stream));
    console.log('Created peer connection object');
  }

  ontrack = (e) => {
    const output = document.getElementById("output")
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.id = this.target;
    if (audio.srcObject !== e.streams[0]) {
      audio.srcObject = e.streams[0];
      console.log('Received remote stream');
      output.appendChild(audio);

      audio.pause()
      this.shh = new Shh(e.streams[0], { threshold: window.threshold || -55 });
      this.shh.on('speaking', () => {
        audio.play()
      });
      this.shh.on('stopped_speaking', () => {
        audio.pause()
    });
    }
  }

  onsignalingstatechange = event => {
    console.log(event)
    switch (this.signalingState) {
      case "closed":
        break;
      default: break;
    }
  }

  oniceconnectionstatechange = event => {
    let audio;
    switch (this.iceConnectionState) {
      case "connected":
        this.onConnect(this.target)
        break;
      case "closed":
        audio = document.getElementById(this.target)
        if (audio) {
          audio.remove()
        }
        this.onClose(this.target);
        break;
      case "failed":
      case "disconnected":
        audio = document.getElementById(this.target)
        if (audio) {
          audio.remove()
        }
        this.onDisconnect(this.target);
        break;
      default: break;
    }
  }

  onicecandidate = e => {
    if (e.candidate) {
      this.signaling.sendToServer({
        type: "new-ice-candidate",
        id: this.id,
        target: this.target,
        candidate: e.candidate
      });
    }
  }

  openDataChannel() {
    const dataChannel = this.createDataChannel("myLabel", {});

    dataChannel.onerror = (error) => {
      console.log("Data Channel Error:", error);
    };

    dataChannel.onmessage = (event) => {
      console.log("Got Data Channel Message:", event.data);
    };

    dataChannel.onopen = () => {
      dataChannel.send("Hello World!");
    };

    dataChannel.onclose = () => {
      console.log("The Data Channel is Closed");
    };
  }

  call() {
    this.onnegotiationneeded = () => {
      this.createOffer({
        voiceActivityDetection: true
      }).then(offer => this.setLocalDescription(offer))
        .then(() =>
          this.signaling.sendToServer({
            id: this.id,
            target: this.target,
            type: "connection-offer",
            sdp: this.localDescription
          })
        ).catch(console.error);
    }
  };

  accept(sdp) {
    return new Promise((resolve, reject) => {
      // console.log("accepting call", this.id, this.target)
      this.setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => this.createAnswer())
        .then(answer => this.setLocalDescription(answer))
        .then(() => {
          this.signaling.sendToServer({
            id: this.id,
            target: this.target,
            type: "connection-answer",
            sdp: this.localDescription,
          });
          resolve();
        }).catch(reject);
    });
  }
  close() {
    if (this.shh) {
      this.shh.close();
      this.shh.stop();
      this.shh = null;
    }
    super.close();
  }
}
