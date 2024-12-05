import OrderForm from './components/OrderForm/OrderForm';
import OrderList from './components/OrderList/OrderList';
import Rate from './components/Rate/Rate';
import styles from './App.module.scss';

const App = () => {
  return (
    <div className={styles.app}>
      <h1>Покупка токенов</h1>
      <Rate />
      <OrderForm />
      <OrderList />
    </div>
  );
};

export default App;
