import { Room, Client, matchMaker } from "colyseus";
import { Stuff } from "./schema/Stuff";
import * as readline from 'readline';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/////////////////////////////////////////
//
//      FNFNet
//        Created by bit of trolling
//      Legend:
//      test - amount of users
//      theY - y position of chatText
//      
//
/////////////////////////////////////////
var scorep1:number;
var scorep2:number;
var clientsconn:Array<String> = new Array();

var song: string;
var diff: number;
var week: number;
/*
      this.onMessage("string", async (client, message) => {

    }
        if (message.join){
            const room = await matchMaker.createRoom("battle", { mode: "duo" });
            
        }
    });
    */
export class BattleRoom extends Room<Stuff> {
  maxClients = 2;
  public static stuff: string;
  static chatHistory: string;
  onCreate (options: any) {
    this.setState(new Stuff());
    this.autoDispose = true;
    song = "";
    diff = 0;
    week = 0
    scorep1 = 0;
    scorep2 = 0;
    console.log(this.roomId);
    this.onMessage('songname', (client, message) => {
      this.setMetadata({song: message.song});
      song = message.song;
      diff = message.diff;
      week = message.week
      try{
        client.send("creatematch", {song: message.song, diff: message.diff, week: message.week});
      }catch(err){
        console.log(err);
      }
    });
    this.onMessage("message", (client, message) => {
      console.log(message.rating);
      if(client.sessionId == this.clients[0].sessionId){
        switch(message.rating){
          case 'shit':
            scorep1 += 50;
          case 'bad':
            scorep1 += 100;
          case 'good':
            scorep1 += 200;
          case 'sick':
            scorep1 += 350;
        }
      }else{
        switch(message.rating){
          case 'shit':
            scorep2 += 50;
          case 'bad':
            scorep2 += 100;
          case 'good':
            scorep2 += 200;
          case 'sick':
            scorep2 += 350;
        }
      }
      try{
        this.clients[0].send("retscore", {p1score: scorep1, p2score: scorep2});
        this.clients[1].send("retscore", {p1score: scorep1, p2score: scorep2});
      }catch(error){
        console.log(error);
      }
    });
  }
  onJoin (client: Client, options: any) {
    console.log('client joined');
    if(this.clients.length != 2) try{ client.send("message", {iden: this.roomId}); }catch(error){ console.log(error); }
    if(this.clients.length >= 2) {
      try{
      this.clients[0].send("message", {iden: this.roomId});
      setTimeout(() => { 
        this.clients[1].send('message', {song: song, diff: diff, week: week});
       }, 1000);
      setTimeout(() => { 
        this.clients[0].send("start");
        this.clients[1].send("start");
       }, 5000);
      }catch(error){ console.log(error); }
    }
  }

  onLeave (client: Client, consented: boolean) {
    console.log("the score is: " + scorep1);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}