import moment = require("moment");

export class ConfigurationTaskV2ModelViewModel {
  constructor(){
  }

  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  recurModel: number;
  recurModelName: string;
  recurMultiplier: number;
  recurDay: number;
  recurMonth: number;
  information: string;

  getResultString(): string {
    if(this.recurModel == 1)
      return this.getResultStringForDaily();
    else if(this.recurModel == 2)
      return this.getResultStringForWeekly();
    else if(this.recurModel == 3)
      return this.getResultStringForMonthly();
    else if(this.recurModel == 4)
      return this.getResultStringForYearly();
  }


  getResultStringForDaily(): string {
    let result = 'Elke ';
    result = result.concat(this.recurMultiplier != null &&  this.recurMultiplier > 1 ? `${this.recurMultiplier} dagen` : 'dag');
    return result;
  }

  getResultStringForWeekly(): string {
    let result = 'Elke ';
    result = result.concat(this.recurMultiplier != null &&  this.recurMultiplier > 1 ? `${this.recurMultiplier} weken` : 'week');
    result = result.concat(` op ${moment().weekday(this.recurDay).format('dddd')}`)
    return result;
  }

  getResultStringForMonthly(): string {
    let result = '';
    if(this.recurMultiplier != null && this.recurMultiplier > 1)
      result = `Om de ${this.recurMultiplier} maanden, elke ${this.getStringForIndex(this.recurDay)} van die maand`;
    else
      result = `Elke ${this.getStringForIndex(this.recurDay)} van de maand`;
    return result;
  }

  getResultStringForYearly(): string {
    let result = 'Elk';
    if(this.recurMultiplier != null && this.recurMultiplier > 1)
      result = result.concat(`e ${this.recurMultiplier}`);
    result = result.concat(` jaar op ${this.recurDay} ${moment().month(this.recurMonth).format('MMMM')}`);
    return result;
  }

  getStringForIndex(nmbr: number): string {
    if((nmbr >= 2 && nmbr <= 7) || nmbr == 9 || nmbr == 10 || (nmbr >= 12 && nmbr <= 19)) return `${nmbr}de`;
    return `${nmbr}ste`;
  }
}
