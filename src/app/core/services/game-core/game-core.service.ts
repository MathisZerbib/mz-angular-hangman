import { PickedWord } from 'src/app/shared/models/PickedWord.model';

export class GameCoreService {
  pickedWord: PickedWord = {
    image: "",
    word: "",
  };
  encryptedWord: string = '';
  attempts: number = 0;
  fails: number = 0;
  win: number = 0;
  loose: number= 0;
  constructor() { }

  public initGame(words: Array<PickedWord>): PickedWord {
    let tempWin;
    let i: number = this.getRandomInt(words.length);
    this.pickedWord = words[i];
    tempWin = localStorage.getItem("ratio")?.toLocaleString()
    this.win = parseInt(tempWin || '');
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

  public getPickedWordImage(): string {
    return this.pickedWord.image || ""
  }

  public getAttempt(): number {
    return this.attempts;

  }
  public setAttempt(int: number): void {
    if(int === 0) {
      this.attempts = 0;
    }
    this.attempts = this.attempts + int;
  }

  public getFail(): number {
    return this.fails;
  }

  public setFail(int: number): void {
    if(int === 0) {
      this.fails = 0;
    }
    this.fails = this.fails + int;
  }

  public isGameStopped() {
    return this.fails >= 6 || this.encryptedWord.indexOf('_') === -1;
  }
  public resultGameStatus() {
    return this.fails >= 6 ? "You lose !" : this.encryptedWord.indexOf('_') === -1 ? "You win !" : "";
  };

  public getRatio() {
    return localStorage.getItem('ratio')?.toString();
  }

  public setRatio() {
    return localStorage.setItem('ratio', this.win.toFixed() )
  }

  public counterRatio() {
    if (this.resultGameStatus() === 'You win !') {
        this.win = this.win + 1;
    }else {  
        this.win = 0;
      }
    this.setRatio();
  }

}
