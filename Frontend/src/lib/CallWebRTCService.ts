// src/services/webrtc.service.ts
import { Socket } from "socket.io-client";

export class CallWebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;

  constructor(private _socket: Socket, private _otherUserId: string) {}

  async initializeCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.createPeerConnection();

      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);

      this._socket.emit("signal", {
        type: "offer",
        content: offer,
        to: this._otherUserId,
      });
    } catch (error) {
      console.error("Call initialization failed:", error);
      this.cleanup();
    }
  }

  async acceptCall() {
    try {
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);
      this._socket.emit("signal", {
        type: "answer",
        content: answer,
        to: this._otherUserId,
      });
      this._socket.emit("call-accepted", {
        to: this._otherUserId,
      });
      
    } catch (error) {
      console.error("Error accepting call:", error);
      this.cleanup();
    }
  }

  private createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks
    this.localStream?.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, this.localStream!);
    });

    // ICE Candidate handling
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this._socket.emit("signal", {
          type: "candidate",
          content: event.candidate,
          to: this._otherUserId,
        });
      }
    };

    // Remote stream handling
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };
  }

  async handleSignal(signal: any) {
    if (!this.peerConnection) this.createPeerConnection();
    try {
      switch (signal.type) {
        case "offer":
          if (!this.localStream) {
            this.localStream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
          }
          if (!this.peerConnection) this.createPeerConnection();
          await this.peerConnection!.setRemoteDescription(signal.content);
          break;

        case "answer":
          if (!this.peerConnection) {
            alert("No peer connection for answer");
            return;
          }
          await this.peerConnection!.setRemoteDescription(signal.content);
          break;

        case "candidate":
          if (this.peerConnection && this.peerConnection.remoteDescription) {
            await this.peerConnection.addIceCandidate(
              new RTCIceCandidate(signal.content)
            );
          }
          break;
      }
    } catch (error) {
      console.error("Signal handling error:", error);
      this.cleanup();
    }
  }

  cleanup() {
    this.peerConnection?.close();
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.remoteStream = null;
    this.peerConnection = null;
  }
}
