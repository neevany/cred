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
      remainders: JSON.parse(
        window.localStorage.getItem('remainders') ||
          JSON.stringify([
            {
              date: moment().format('MMDDYYYY'),
              title: 'Dentist Appointemnt',
              location: 'Bangalore',
              time: '10:30-11:00',
            },
            {
              date: moment().format('MMDDYYYY'),
              title: 'Sprint Planning',
              location: 'Bangalore',
              time: '11:30-12:30',
            },
          ])
      ),
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

  renderRemainders() {
    return (
      <div className="remainders">
        <div className="header">
          <div>
            <div className="remainder-date-lable">
              {this.state.selected.fromNow()}
            </div>
            <div className="remainder-date">
              {this.state.selected.format('DD/MM/YYYY')}
            </div>
          </div>
          <b>Add New</b>
        </div>
        <div className="remainders-list">
          <ul>
            {this.state.remainders
              .filter(r => r.date === this.state.selected.format('MMDDYYYY'))
              .map(r => (
                <li class="item">
                  <div>
                    <div>{r.title}</div>
                    <div>
                      <i className="icon fa fa-map-marker" />
                      {r.location}
                    </div>
                    <div>
                      <i className="icon fa fa-clock-o" />
                      {r.time}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="calendar-container">
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
        {this.renderRemainders()}
      </div>
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
