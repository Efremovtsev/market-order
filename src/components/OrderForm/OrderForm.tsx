import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { orderStore } from '../../stores/OrderStore';
import styles from './OrderForm.module.scss';

const OrderForm = observer(() => {
  const [inputMode, setInputMode] = useState<'tokens' | 'dollars'>('tokens');
  const [amountTokens, setAmountTokens] = useState(0);
  const [amountDollars, setAmountDollars] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    orderStore.createOrder(amountTokens, amountDollars);
    setAmountTokens(0);
    setAmountDollars(0);
  };

  useEffect(() => {
    if (inputMode === 'tokens') {
      setAmountDollars(
        amountTokens ? parseFloat((amountTokens * orderStore.tokenRate).toFixed(2)) : 0,
      );
    } else {
      setAmountTokens(
        amountDollars ? parseFloat((amountDollars / orderStore.tokenRate).toFixed(2)) : 0,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountTokens, amountDollars, inputMode, orderStore.tokenRate]);

  return (
    <form className={styles.orderForm} onSubmit={handleSubmit}>
      <div className={styles.toggleSwitch}>
        <label>
          <input
            type="radio"
            checked={inputMode === 'tokens'}
            onChange={() => setInputMode('tokens')}
          />
          Ввести сумму в токенах
        </label>
        <label>
          <input
            type="radio"
            checked={inputMode === 'dollars'}
            onChange={() => setInputMode('dollars')}
          />
          Ввести сумму в долларах
        </label>
      </div>

      {inputMode === 'tokens' ? (
        <div className={styles.inputGroup}>
          <label>Сумма в токенах:</label>
          <input
            type="number"
            value={amountTokens}
            onChange={(e) => setAmountTokens(parseFloat(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <label>Сумма в долларах:</label>
          <input
            type="number"
            value={amountDollars}
            onChange={(e) => setAmountDollars(parseFloat(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
      )}

      <div className={styles.calculatedAmount}>
        {inputMode === 'tokens'
          ? `Сумма в долларах: ${amountDollars}`
          : `Сумма в токенах: ${amountTokens}`}
      </div>

      <button type="submit">Создать ордер</button>
    </form>
  );
});

export default OrderForm;
