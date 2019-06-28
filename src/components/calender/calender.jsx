import React, { Component } from 'react';
import moment from 'moment';
import './calender.less';

import Modal from '../modal/modal';

const weekDaysShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const monthsList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    // Initialize Remainders
    if (!window.localStorage.getItem('remainders')) {
      window.localStorage.setItem(
        'remainders',
        JSON.stringify([
          {
            date: moment().format('YYYY-MM-DD'),
            title: 'Dentist Appointemnt',
            location: 'Bangalore',
            time: '10:30-11:00',
          },
          {
            date: moment().format('YYYY-MM-DD'),
            title: 'Sprint Planning',
            location: 'Bangalore',
            time: '11:30-12:30',
          },
        ])
      );
    }
    this.state = {
      month: moment(),
      selected: moment().startOf('day'),
      remainders: JSON.parse(window.localStorage.getItem('remainders')),
      remainder: {
        date: moment().format('YYYY-MM-DD'),
      },
      changeMonth: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      addRemainderModal: false,
      remaindersFullScreen: false,
      changeMonthModalOpen: false,
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
      remainder: {
        date: day.date.format('YYYY-MM-DD'),
      },
    });
  }

  makeFullScreen() {
    this.setState({ remaindersFullScreen: true });
  }

  closeFullScreen() {
    this.setState({ remaindersFullScreen: false });
  }

  openAddRemainder() {
    this.setState({ addRemainderModal: true });
  }

  closeAddRemainder() {
    this.setState({ addRemainderModal: false });
  }

  openChangeMonthModal() {
    this.setState({ changeMonthModalOpen: true });
  }

  closeChangeMonthModal() {
    this.setState({ changeMonthModalOpen: false });
  }

  handleRemainderField(e, field) {
    let { remainder } = this.state;
    remainder[field] = e.target.value;
    this.setState({ remainder: remainder });
  }

  handleChangeMonthField(e, field) {
    let { changeMonth } = this.state;
    changeMonth[field] = e.target.value;
    this.setState({ changeMonth: changeMonth });
  }

  addRemainder() {
    let { remainders, remainder, selected, addRemainderModal } = this.state;
    remainders.push(remainder);
    // reset remainder
    remainder = {
      title: '',
      location: '',
      time: '',
      date: selected.format('YYYY-MM-DD'),
    };
    addRemainderModal = false;
    // Save to localstorage
    window.localStorage.setItem('remainders', JSON.stringify(remainders));
    this.setState({ remainders, remainder, addRemainderModal });
  }

  renderRemaindersModal() {
    let { remainder, addRemainderModal } = this.state;
    return (
      <Modal
        isModalOpen={this.state.addRemainderModal}
        closeModal={() => this.closeAddRemainder()}
      >
        <div className="add-remainder-form">
          <div className="close-button">
            <i
              onClick={() => this.closeAddRemainder()}
              className="icon fa fa-close"
            />
          </div>
          <div>
            <label>Add Remainder</label>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              onChange={e => this.handleRemainderField(e, 'date')}
              value={remainder.date}
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              onChange={e => this.handleRemainderField(e, 'title')}
              value={remainder.title}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              onChange={e => this.handleRemainderField(e, 'location')}
              value={remainder.location}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="text"
              className="form-control"
              onChange={e => this.handleRemainderField(e, 'time')}
              value={remainder.time}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => this.addRemainder()}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  changeMonth() {
    this.setState({
      month: moment(
        new Date(this.state.changeMonth.year, this.state.changeMonth.month)
      ),
    });
    this.closeChangeMonthModal();
  }

  renderChangeMonthModal() {
    let { changeMonthModalOpen } = this.state;
    let years = [];
    for (let i = 1970; i < 2100; i++) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return (
      <Modal
        isModalOpen={changeMonthModalOpen}
        closeModal={() => this.closeChangeMonthModal()}
      >
        <div>
          <label>Select month and year</label>
        </div>
        <div className="input-group">
          <select
            className="form-control"
            value={this.state.changeMonth.month}
            onChange={e => this.handleChangeMonthField(e, 'month')}
          >
            {monthsList.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="form-control"
            value={this.state.changeMonth.year}
            onChange={e => this.handleChangeMonthField(e, 'year')}
          >
            {years}
          </select>
        </div>
        <br />
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={() => this.changeMonth()}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </Modal>
    );
  }

  renderRemainders() {
    let remainders = this.state.remainders.filter(
      r => r.date === this.state.selected.format('YYYY-MM-DD')
    );
    return (
      <div
        className={
          'remainders' +
          (this.state.remaindersFullScreen ? ' active' : '') +
          (this.state.selected.format('dddd') === 'Sunday' ||
          this.state.selected.format('dddd') === 'Saturday'
            ? ' weekend'
            : '')
        }
      >
        <div className="close-button">
          {this.state.remaindersFullScreen ? (
            <i
              onClick={() => this.closeFullScreen()}
              className="icon fa fa-close"
            />
          ) : null}
        </div>
        {this.renderRemaindersModal()}
        <div className="header">
          <div>
            <div className="remainder-date-lable">
              {this.state.selected.fromNow()}
            </div>
            <div className="remainder-date">
              {this.state.selected.format('DD/MM/YYYY')}
            </div>
          </div>
          <b className="add-button" onClick={() => this.openAddRemainder()}>
            Add New
          </b>
        </div>
        {remainders.length === 0 ? 'No Remainders' : ''}
        <div className="remainders-list" onClick={() => this.makeFullScreen()}>
          <ul>
            {remainders.map((r, i) => (
              <li className="item" key={i}>
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
      <div className="cred-calendar-container">
        <section className="cred-calendar">
          <header className="header">
            <div className="month-display cred-calendar-row">
              <i
                className="arrow fa fa-angle-left"
                onClick={() => this.previous()}
              />
              <span
                className="month-label"
                onClick={() => this.openChangeMonthModal()}
              >
                {this.state.month.format('MMMM YYYY')}
              </span>
              {this.renderChangeMonthModal()}
              <i
                className="arrow fa fa-angle-right"
                onClick={() => this.next()}
              />
            </div>
            <div className="cred-calendar-row day-names">
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
      <div className="cred-calendar-row week" key={days[0]}>
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
