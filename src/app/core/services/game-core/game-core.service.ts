import { Injectable } from '@angular/core';
import { PickedWord } from 'src/app/shared/models/PickedWord.model';

@Injectable({
  providedIn: 'root'
})
export class GameCoreService {
  pickedWord: PickedWord = {
    image: "",
    word: "",
  };
  encryptedWord: string = '';

  isGameStopped = () => {
    return this.fails >= 6 || this.encryptedWord.indexOf('_') === -1;
  }
  resultGameStatus = () => {
    return this.fails >= 6 ? "You lose !" : this.encryptedWord.indexOf('_') === -1 ? "You win !" : "";
  };

  attempts: number = 0;
  fails: number = 0;

  // isGameStopped = this.fails >= 6 || this.encryptedWord.indexOf('_') === -1;
  // resultGameStatus = this.fails >= 6 ? "You lose !" : this.encryptedWord.indexOf('_') === -1 ? "You win !" : "";

  constructor() { }

  public initGame(words: Array<PickedWord>): PickedWord {
    let i: number = this.getRandomInt(words.length);
    this.pickedWord = words[i];
    console.log('Yay you\'re smart:', this.pickedWord.word)
    return this.pickedWord;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  public getEncryptedWord(): string {
    return this.encryptedWord;
  }
  public setEncryptWord(): string {
    this.encryptedWord = this.pickedWord.word.replace(/[a-zA-Z]/g, '_');
    return this.encryptedWord;
  }

  public replaceAt(str: string, index: number, chr: string): string {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  public reset(): void {
    this.setEncryptWord();
    this.attempts = 0;
    this.fails = 0;
  }

  public getPickedWord(): PickedWord {
    return this.pickedWord
  }



  public getAttempt(): number {
    return this.attempts;

  }
  public setAttempt(): void {
    this.attempts = this.attempts + 1;
  }

  public getFail(): number {
    return this.fails;
  }

  public setFail(): void {
    this.fails = this.fails + 1;
  }

}
