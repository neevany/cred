import React, { Component } from 'react';
import './app.less';

import Calendar from './components/calender/calender';

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="cred-container">
        <Calendar />
      </div>
    );
  }
}

export default AppComponent;
