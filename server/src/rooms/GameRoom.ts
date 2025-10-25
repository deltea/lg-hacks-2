import { Room, Client } from "@colyseus/core";
import { RoomState, Player } from "./schema/RoomState";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class GameRoom extends Room<RoomState> {
  maxClients = 4;
  state = new RoomState();

  generateRoomIdSingle(): string {
      let result = '';
      for (var i = 0; i < 6; i++) {
          result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
      }
      return result;
  }
  
  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers("room_ids");
    let id;
    do {
      id = this.generateRoomIdSingle();
    } while (currentIds.includes(id));

    await this.presence.sadd("room_ids", id);
    return id;
  }

  async onCreate (options: any) {
    this.roomId = await this.generateRoomId();
    this.onMessage("crea", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: { name: string }) {
    console.log(client.sessionId, "joined room", this.roomId);
    const isHost = this.state.players.size === 0;
    this.state.players.set(client.sessionId, new Player({ isHost, name: options.name }));
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left room", this.roomId);
    this.state.players.delete(client.sessionId)
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
