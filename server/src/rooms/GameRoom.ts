import { Room, Client } from "@colyseus/core";
import { RoomState, Player, Round, Song, Prompt } from "./schema/RoomState";

function shuffled<T>(iterable: Iterable<T>): T[] {
  const array = [...iterable];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


export class GameRoom extends Room<RoomState> {
  maxClients = 10;
  state = new RoomState();
  roundInterval: NodeJS.Timeout;

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
    this.onMessage("startGame", (client, message) => {
      if (this.state.state === 'lobby' && this.state.players.get(client.sessionId)?.isHost) {
        this.state.state = 'game';
        this.state.round = 0;
        this.state.playerOrder = shuffled(this.state.players.keys());
        this.state.rounds = new Array(this.state.players.size).fill(null).map(
          (): Round[] => []);
        this.startRound();
      }
    });
    this.onMessage("submit", (client, { round, data }) => {
      if (this.state.state !== 'lobby') return;
      const order = this.state.playerOrder.indexOf(client.sessionId);
      if (order === -1) return;
      this.state.rounds[(order + round) % this.state.playerOrder.length][round] = 
        round % 2 ? new Song(data) : new Prompt(data); 
    });
  }

  startRound() {
    this.state.roundStart = Date.now();
    this.roundInterval = setInterval(this.endRound.bind(this), this.state.roundDuration);
  }

  endRound() {
    clearInterval(this.roundInterval);
    for (let i = 0; i < this.state.playerOrder.length; i++) {
      if (!this.state.players.has(this.state.playerOrder[i])) {
        // answer with bot
        let answer;
        if (this.state.round % 2) {

        } else {

        }

      }
    }
    this.state.round++;
    if (this.state.round === this.state.playerOrder.length) {
      this.state.round = 0;
      this.state.state = 'result';
    }
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
