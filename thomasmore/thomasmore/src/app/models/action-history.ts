import {Action} from './action';

export class ActionHistory {
  id: number;
  action: Action;
  moreInfo: string;
  status: string;
  executors: string;
}
