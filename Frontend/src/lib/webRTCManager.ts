import { Socket } from "socket.io-client";

export class WebRTCManager {
  private peers = new Map<string, RTCPeerConnection>();
  private localStream?: MediaStream;
  private socket: Socket;
  private onStreamUpdate?: (peerId: string, stream: MediaStream) => void;

  constructor(
    socket: Socket,
    onStreamUpdate?: (peerId: string, stream: MediaStream) => void
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
      return this.localStream;
    } catch (error) {
      console.log(error);
    }
  }

  private setupSocketListeners() {
    try {
      // retreiving all the userId except current me and creating peer connection
      this.socket.on("existing-peers", (peerIds: string[]) => {
        peerIds.forEach((peerId) => this.createPeerConnection(peerId));
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
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              this.sendSignal(senderId, "answer", answer);
              break;

            case "answer":
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
              break;

            case "candidate":
              pc.addIceCandidate(new RTCIceCandidate(signal));
              break;
          }
        }
      );

      this.socket.on("peer-disconnected", (peerId: string) => {
        this.peers.get(peerId)?.close();
        this.peers.delete(peerId);
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async createPeerConnection(peerId: string) {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      this.localStream?.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });

      pc.ontrack = (event) => {
        const stream = event.streams[0];
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

      if (peerId > this.socket.id!) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        this.sendSignal(peerId, "offer", offer);
      }
    } catch (error) {
      console.log(error);
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
    this.peers.forEach((pc) => pc.close());
    this.localStream?.getTracks().forEach((track) => track.stop());
  }
}
