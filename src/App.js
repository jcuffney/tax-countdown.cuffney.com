import React, { useState, useCallback, useEffect, memo } from 'react';
// import PropTypes from 'prop-types';
import cx from 'classnames';
import Confetti from 'react-confetti';
import { formatDistanceStrict, parseISO, differenceInSeconds } from 'date-fns';


// import logo from './logo.svg';
import './App.css';

const styles = {};

export const calculateDifference = timeLeft => {
  const secondsYear = 365 * 24 * 60 * 60;
  const secondsMonth = 365 / 12 * 24 * 60 * 60;
  const secondsDay = 24 * 60 * 60;

  const years = Math.floor(timeLeft / secondsYear);

  const months = Math.floor((timeLeft - years * secondsYear) / secondsMonth);

  const days = Math.floor((timeLeft - (years * secondsYear + months * secondsMonth)) / secondsDay);
  const hours = Math.floor(
    (timeLeft - (years * secondsYear + months * secondsMonth + days * secondsDay)) / (60 * 60),
  );
  const minutes = Math.floor(
    (timeLeft - (years * secondsYear + months * secondsMonth + days * secondsDay + hours * 60 * 60)) / 60);
  const seconds = Math.floor(timeLeft % 60);
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

const App = ({
  endDate = '2021-04-15T10:00:00.000Z',
  onPhaseComplete = () => {},
  message = 'Until Tax Season is Over',
  className,
}) => {
  const time = differenceInSeconds(new Date(endDate), new Date());
  const [granularity, setGranualarity] = useState(true);
  const [timeLeft, setTimeLeft] = useState(time);
  
  const { years, months, days, hours, minutes, seconds } = calculateDifference(timeLeft);

  const handleToggleGranularity = useCallback(() => {
    setGranualarity(!granularity);
  }, [setGranualarity, granularity]);

  const handleTick = () => {
    if (timeLeft < -3) return onPhaseComplete();
    setTimeLeft(timeLeft - 1);
  };

  useEffect(() => {
    const interval = setInterval(handleTick, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    setTimeLeft(time);
  }, [time]);
  
  if (timeLeft <= -5) {
    return (
      <div className={ cx(styles.countdown, styles.archived, className) }>
        <p className={ styles.message }>Archived.</p>
      </div>
    );
  }

  if (timeLeft <= 0) {
    return (
      <div className={ cx(styles.countdown, className) }>
        <Confetti recycle={ false } width={ (window.innerWidth - 25) } />
        <p className={ styles.message }>{ message.nextPhaseMessage }</p>
      </div>
    );
  }

  return (
    <div className={ cx("App", styles.countdown, className) } onClick={ handleToggleGranularity }>
      <div className='App-header'>
        { granularity && (
          <span className={ styles.time }>
            { years ? (<>{ `${ years }Y ` }</>) : null }
            { months ? (<>{ `${ months }M ` }</>) : null }
            { days ? (<>{ `${ days }d ` }</>) : null }
            { hours ? (<>{ `${ hours }h ` }</>) : null }
            { minutes ? (<>{ `${ minutes }m ` }</>) : null }
            { seconds }s
          </span>
        ) }
        { !granularity && (
          <span>
            { formatDistanceStrict(
              new Date(),
              parseISO(new Date(endDate).toISOString())
            ) }
          </span>
        ) }
        <p className={ styles.message }>{ message }</p>
      </div>
    </div>
  );
};

export default memo(App);
