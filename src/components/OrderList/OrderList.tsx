import { observer } from 'mobx-react-lite';
import { orderStore } from '../../stores/OrderStore';
import styles from './OrderList.module.scss';

const OrderList = observer(() => {
  return (
    <div className={styles.orderList}>
      <h2>Список ордеров</h2>
      {orderStore.ordersByCreatedAt.map((order) => (
        <div key={order.id} className={styles.orderItem}>
          <div>ID ордера: {order.id}</div>
          <div>
            Сумма: {order.amountTokens} токенов = {order.amountDollars} долларов
          </div>
          <div>Статус: {order.status}</div>
          <div>Время создания: {new Date(order.createdAt).toLocaleString('ru-RU')}</div>
        </div>
      ))}
    </div>
  );
});

export default OrderList;
