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
  loose: number = 0;
  constructor() { }

  /**
  * This is the initGame function
  * Pick a word in the list, set the ratio in persistent local Storage
  * @param words This is the wordslist parameter
  * @returns returns a string version of this.pickedWord
  */

  public initGame(words: Array<PickedWord>): PickedWord {
    var tempWin: string;
    let i: number = this.getRandomInt(words.length);
    this.pickedWord = words[i];
    tempWin = localStorage.getItem("ratio")?.toLocaleString() || "";
    localStorage.setItem('ratio', tempWin || "")
    this.win = parseInt(tempWin || '');
    if (!localStorage.getItem('ratio')) {
      this.win = 0;
      localStorage.setItem('ratio', '0');
    }
    console.log('Yay you\'re smart but it gonna be less fun if you don\'t close the dev tools ;) :', this.pickedWord.word)
    return this.pickedWord;
  }

  /* Get a int between 0 & params :max: */
  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /* return word encrypted  */
  public getEncryptedWord(): string {
    return this.encryptedWord;
  }

  /* return word encrypted  */

  public setEncryptWord(): string {
    this.encryptedWord = this.pickedWord.word.replace(/[a-zA-Z]/g, '_');
    return this.encryptedWord;
  }

  /**
  * This is the replaceAt function
  * It replace every letter that match a or more letter in the word
  * @param str This is the letter parameter
  * @param index This is the index word parameter where the letter is found at
  * @param chr This is the current word parameter
  * @returns returns the letter replaced
  */

  public replaceAt(str: string, index: number, chr: string): string {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  /* reset the game, the crypted word, reset the fails & attempts  */

  public reset(): void {
    this.setEncryptWord();
    this.attempts = 0;
    this.fails = 0;
  }

  /* return word picked object  */

  public getPickedWord(): PickedWord {
    return this.pickedWord
  }

  /* return word picked image or "" if image is undefined */

  public getPickedWordImage(): string {
    return this.pickedWord.image || ""
  }
  /* return attempts   */

  public getAttempt(): number {
    return this.attempts;
  }


  /* set attempts  */

  public setAttempt(int: number): void {
    if (int === 0) {
      this.attempts = 0;
    }
    this.attempts = this.attempts + int;
  }

  /* return fails  */

  public getFail(): number {
    return this.fails;
  }
  /* set fails  */

  public setFail(int: number): void {
    if (int === 0) {
      this.fails = 0;
    }
    this.fails = this.fails + int;
  }
  /* return state of the game  */

  public isGameStopped() {
    return this.fails >= 6 || this.encryptedWord.indexOf('_') === -1;
  }
  /* return status of the game  */

  public resultGameStatus() {
    return this.fails >= 6 ? "You lose !" : this.encryptedWord.indexOf('_') === -1 ? "You win !" : "";
  };
  /* get current max win in a row  */

  public getRatio() {
    return localStorage.getItem('ratio')?.toString();
  }

  /* Set max win in a row  */
  public setRatio() {
    return localStorage.setItem('ratio', this.win.toFixed())
  }

  /* Set Ratio On win / Loose */
  public counterRatio() {
    if (this.resultGameStatus() === 'You win !') {
      this.win = this.win + 1;
    } else {
      this.win = 0;
    }
    this.setRatio();
  }

}
