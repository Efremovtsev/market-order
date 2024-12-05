import { observer } from 'mobx-react-lite';
import { orderStore } from '../../stores/OrderStore';
import styles from './Rate.module.scss';

const Rate = observer(() => {
  return (
    <div className={styles.rate}>
      Текущий курс: 1 токен = {orderStore.tokenRate} долларов
    </div>
  );
});

export default Rate;
