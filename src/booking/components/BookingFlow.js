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
    paymentMethos: null,
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'hotel':
        const { hotel } = action.payload;
        return { ...state, step: 2, hotel };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const selectHotel = hotel => dispatch({ type: 'hotel', payload: { hotel } });

  return (
    <>
      <Section>
        <BookingCompletionStatus step={state.step} />
      </Section>
      <Section>
        {state.step === 1 && <SelectHotel selectHotel={selectHotel} />}
        {state.step === 2 && <SelectPaymentMethod hotel={state.hotel} />}
        {state.step === 3 && <ConfirmBooking />}
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
