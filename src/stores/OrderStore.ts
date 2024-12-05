import { observable, action, makeObservable, computed } from 'mobx';
import { io, Socket } from 'socket.io-client';
import type { Order } from './types';

export class OrderStore {
  @observable tokenRate: number = 0;
  @observable orders: Order[] = [];
  socket: Socket;

  @computed get ordersByCreatedAt() {
    return [...this.orders].reverse();
  }

  constructor() {
    makeObservable(this);
    this.socket = io('/', { path: '/socket.io', transports: ['websocket'] });

    // Getting the current token rate
    this.socket.on('tokenRate', this.setTokenRate);

    // Getting the list of orders
    this.socket.on('orderList', this.setOrderList);

    // Update when adding a new order
    this.socket.on('newOrder', this.addOrder);

    // Updating the order status
    this.socket.on('orderUpdated', this.updateOrderStatus);
  }

  @action.bound
  setTokenRate(rate: number) {
    this.tokenRate = parseFloat(rate.toString());
  }

  @action.bound
  setOrderList(orders: Order[]) {
    this.orders = orders;
  }

  @action.bound
  addOrder(order: Order) {
    this.orders.push(order);
  }

  @action.bound
  updateOrderStatus(updatedOrder: Order) {
    const index = this.orders.findIndex((o) => o.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
  }

  @action.bound
  createOrder(amountTokens: number, amountDollars: number) {
    fetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountTokens, amountDollars }),
    });
  }
}

export const orderStore = new OrderStore();
