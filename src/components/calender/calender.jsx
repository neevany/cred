import React, { Component } from 'react';
import moment from 'moment';
import './calender.less';

const weekDaysShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: moment(),
      selected: moment().startOf('day'),
    };
  }

  previous() {
    const { month } = this.state;
    this.setState({
      month: month.subtract(1, 'month'),
    });
  }

  next() {
    const { month } = this.state;
    this.setState({
      month: month.add(1, 'month'),
    });
  }

  select(day) {
    this.setState({
      selected: day.date,
      month: day.date.clone(),
    });
  }

  renderWeeks() {
    let weeks = [];
    let done = false;
    let date = this.state.month
      .clone()
      .startOf('month')
      .add('w' - 1)
      .day('Monday');
    let count = 0;
    let monthIndex = date.month();

    const { selected, month } = this.state;

    while (!done) {
      weeks.push(
        <Week
          key={date}
          date={date.clone()}
          month={month}
          select={day => this.select(day)}
          selected={selected}
        />
      );
      date.add(1, 'w');
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
    return weeks;
  }

  render() {
    return (
      <section className="calendar">
        <header className="header">
          <div className="month-display row">
            <i
              className="arrow fa fa-angle-left"
              onClick={() => this.previous()}
            />
            <span className="month-label">
              {this.state.month.format('MMMM YYYY')}
            </span>
            <i
              className="arrow fa fa-angle-right"
              onClick={() => this.next()}
            />
          </div>
          <div className="row day-names">
            {weekDaysShort.map((wD, index) => (
              <span
                key={index}
                className={'day' + (wD === 'S' ? ' weekend' : '')}
              >
                {wD}
              </span>
            ))}
          </div>
        </header>
        {this.renderWeeks()}
      </section>
    );
  }
}

class Week extends React.Component {
  render() {
    let days = [];
    let { date } = this.props;

    const { month, selected, select } = this.props;

    for (var i = 0; i < 7; i++) {
      let day = {
        name: date.format('dd').substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), 'day'),
        isWeekend:
          date.format('dddd') === 'Sunday' ||
          date.format('dddd') === 'Saturday',
        date: date,
      };
      days.push(<Day key={i} day={day} selected={selected} select={select} />);

      date = date.clone();
      date.add(1, 'day');
    }

    return (
      <div className="row week" key={days[0]}>
        {days}
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const {
      day,
      day: { date, isCurrentMonth, isToday, isWeekend, number },
      select,
      selected,
    } = this.props;

    return (
      <span
        key={date.toString()}
        className={
          'day' +
          (isToday ? ' today' : '') +
          (isWeekend ? ' weekend' : '') +
          (isCurrentMonth ? '' : ' different-month') +
          (date.isSame(selected) ? ' selected' : '')
        }
        onClick={() => select(day)}
      >
        {number}
      </span>
    );
  }
}

export default Calendar;
