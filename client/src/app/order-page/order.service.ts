import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";

@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public price = 0;

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const candidate = this.list.find(p => p._id === orderPosition._id);
    if (candidate){
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition)
    }

  }
  remove() {

  }
  clear() {

  }
}
