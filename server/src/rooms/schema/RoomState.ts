import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class Round extends Schema {
  @type("string") player: string;
}

export class Prompt extends Round {
  @type("string") content: string
}

export class Song extends Round {
  @type("number") tempo: number;
  @type({ array: { array: { array: "boolean" } } }) notes: boolean[][][];
}

export class Player extends Schema {
  @type("string") name: string;
  @type("boolean") isHost: boolean;
  // @type("boolean") disconnected: boolean;
}

export class RoomState extends Schema {
  @type("string") state: "lobby" | "game" | "result" = "lobby";
  @type("number") round: number;
  @type("number") roundStart: number;
  @type("number") roundDuration: number = 60 * 1000;
  @type({ array: { array: Round } }) rounds: Round[][];
  @type({ array: "string" }) playerOrder: string[];
  @type({ map: Player }) players = new MapSchema<Player>();
}
