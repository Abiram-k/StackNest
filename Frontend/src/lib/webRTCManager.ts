import { Socket } from "socket.io-client";
const TURN_CRED = import.meta.env.VITE_TURN_CRED;
const INSTANCE_IP = import.meta.env.VITE_INSTANCE_IP;
export class WebRTCManager {
  private peers = new Map<string, RTCPeerConnection>();
  private localStream?: MediaStream;
  private socket: Socket;
  private onStreamUpdate?: (peerId: string, stream: MediaStream | null) => void;

  private remoteStreams: { [key: string]: MediaStream } = {};

  constructor(
    socket: Socket,
    onStreamUpdate?: (peerId: string, stream: MediaStream | null) => void
  ) {
    this.socket = socket;
    this.onStreamUpdate = onStreamUpdate;
    this.setupSocketListeners();
  }

  async initializeLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Local Id from initializeLocalStream(): ", this.socket.id);
      return this.localStream;
    } catch (error) {
      console.log(error);
    }
  }

  private setupSocketListeners() {
    try {
      // retreiving all the userId except current me and creating peer connection
      this.socket.on("existing-peers", (peerIds: string[]) => {
        peerIds.forEach((peerId) => {
          if (!this.peers.has(peerId))
            // new addedd 🧾
            this.createPeerConnection(peerId);
        });
      });

      // creating peer connection for new joinee
      this.socket.on("new-peer", (peerId: string) => {
        this.createPeerConnection(peerId);
      });

      this.socket.on(
        "signal",
        async ({
          senderId,
          type,
          signal,
        }: {
          senderId: any;
          type: any;
          signal: any;
        }) => {
          const pc = this.peers.get(senderId);
          if (!pc) {
            console.log("no peer connection");
            return;
          }

          switch (type) {
            case "offer":
              if (pc.signalingState !== "stable") {
                console.warn("Ignoring offer; not in stable state");
                return;
              }
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              this.sendSignal(senderId, "answer", answer);
              break;

            case "answer":
              if (pc.signalingState !== "have-local-offer") {
                console.warn("Ignoring answer; not in have-local-offer state");
                return;
              }
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
              break;

            case "candidate":
              if (pc.remoteDescription) {
                pc.addIceCandidate(new RTCIceCandidate(signal));
              } else {
                console.warn(
                  "Remote description not set. Queueing candidate..."
                );
              }
              // pc.addIceCandidate(new RTCIceCandidate(signal));
              break;
          }
        }
      );

      this.socket.on("peer-disconnected", (peerId: string) => {
        this.peers.get(peerId)?.close();
        this.peers.delete(peerId);
        delete this.remoteStreams[peerId];
        if (this.onStreamUpdate) {
          this.onStreamUpdate(peerId, null);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async createPeerConnection(peerId: string) {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: `turn:${INSTANCE_IP}:3478?transport=udp`,
            username: "user",
            credential: TURN_CRED,
          },
        ],
      });

      this.localStream?.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        this.remoteStreams[peerId] = stream;
        if (this.onStreamUpdate) {
          this.onStreamUpdate(peerId, stream);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignal(peerId, "candidate", event.candidate);
        }
      };

      this.peers.set(peerId, pc);

      // if (peerId > this.socket.id!) {
      if (this.socket.id! < peerId) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        this.sendSignal(peerId, "offer", offer);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public getRemoteStreams() {
    return this.remoteStreams;
  }

  toggleAudio(isMuted: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  }

  toggleVideo(isVideoOn: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn;
      });
    }
  }

  //
  private sendSignal(
    targetId: string,
    type: "offer" | "answer" | "candidate",
    signal: any
  ) {
    this.socket.emit("signal", { targetId, type, signal });
  }

  cleanup() {
    // this.peers.forEach((pc) => pc.close());
    // this.localStream?.getTracks().forEach((track) => track.stop());
    this.peers.forEach((pc) => {
      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.close();
    });

    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peers.clear();

    this.socket.off("existing-peers");
    this.socket.off("new-peer");
    this.socket.off("signal");
    this.socket.off("peer-disconnected");

    this.remoteStreams = {};
  }
}
