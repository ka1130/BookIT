import React, { useReducer } from 'react';
import { Segment } from 'semantic-ui-react';
import SelectHotel from './SelectHotel';

import SelectPaymentMethod from './SelectPaymentMethod';
import ConfirmBooking from './ConfirmBooking';
import BookingCompletionStatus from './BookingCompletionStatus';

const BookingFlow = () => {
  const initialState = {
    step: 1,
    hotel: null,
    paymentMethod: null,
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'hotel':
        const { hotel } = action.payload;
        return { ...state, step: 2, hotel };
      case 'paymentMethod':
        const { paymentMehod } = action.payload;
        return { ...state, step: 3, paymentMehod };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const selectHotel = hotel => dispatch({ type: 'hotel', payload: { hotel } });
  const selectPaymentMethod = paymentMehod => {
    dispatch({ type: 'paymentMethod', payload: { paymentMehod } });
  };

  const { step, hotel, paymentMethod } = state;

  return (
    <>
      <Section>
        <BookingCompletionStatus step={step} />
      </Section>
      <Section>
        {step === 1 && <SelectHotel selectHotel={selectHotel} />}
        {step === 2 && (
          <SelectPaymentMethod
            hotel={hotel}
            selectPaymentMethod={selectPaymentMethod}
          />
        )}
        {step === 3 && (
          <ConfirmBooking paymentMethod={paymentMethod} hotel={hotel} />
        )}
      </Section>
    </>
  );
};
const Section = ({ children }) => {
  return (
    <Segment vertical style={{ padding: '2em 0em' }}>
      {children}
    </Segment>
  );
};

export default BookingFlow;
