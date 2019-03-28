import {ActionHistory} from './action-history';
import {Cage} from './cage';

export class ActionHistoryComment {
  id: number;
  actionHistory: ActionHistory;
  cage: Cage;
  comment: string;
}
