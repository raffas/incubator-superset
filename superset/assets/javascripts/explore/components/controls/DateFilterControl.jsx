import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, ButtonGroup, FormControl, InputGroup,
  Label, OverlayTrigger, Popover, Glyphicon,
} from 'react-bootstrap';
import Select from 'react-select';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
require('moment/locale/it');

import ControlHeader from '../ControlHeader';
import PopoverSection from '../../../components/PopoverSection';

const RELATIVE_TIME_OPTIONS = ['fà', 'da adesso'];
const TIME_GRAIN_OPTIONS = ['secondi', 'minuti', 'giorni', 'settimane', 'mesi', 'anni'];

const propTypes = {
  animation: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  height: PropTypes.number,
};

const defaultProps = {
  animation: true,
  onChange: () => {},
  value: '',
};

export default class DateFilterControl extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || '';
    this.state = {
      num: '7',
      grain: 'giorni',
      rel: 'fà',
      dttm: '',
      type: 'libera',
      free: '',
    };
    const words = value.split(' ');
    if (words.length >= 3 && RELATIVE_TIME_OPTIONS.indexOf(words[2]) >= 0) {
      this.state.num = words[0];
      this.state.grain = words[1];
      this.state.rel = words[2];
      this.state.type = 'rel';
    } else if (moment(value).isValid()) {
      this.state.dttm = value;
      this.state.type = 'fix';
    } else {
      this.state.free = value;
      this.state.type = 'free';
    }
  }
  onControlChange(target, opt) {
    this.setState({ [target]: opt.value });
  }
  onNumberChange(event) {
    this.setState({ num: event.target.value });
  }
  onFreeChange(event) {
    this.setState({ free: event.target.value });
  }
  setType(type) {
    this.setState({ type });
  }
  setValueAndClose(val) {
    this.setState({ type: 'free', free: val }, this.close);
  }
  setDatetime(dttm) {
    this.setState({ type:'fix', dttm: dttm.format().substring(0, 19) }, this.close);
  }
  close() {
    let val;
    if (this.state.type === 'rel') {
      val = `${this.state.num} ${this.state.grain} ${this.state.rel}`;
    } else if (this.state.type === 'fix') {
      val = this.state.dttm;
    } else if (this.state.type === 'free') {
      val = this.state.free;
    }
    this.props.onChange(val);
    this.refs.trigger.hide();
  }
  renderPopover() {
    return (
      <Popover id="filter-popover">
        <div style={{ width: '250px' }}>
          <PopoverSection
            title="Seleziona la data"
            isSelected={this.state.type === 'fix'}
            onSelect={this.setType.bind(this, 'fix')}
          >
            <InputGroup bsSize="small">
              <InputGroup.Addon>
                <Glyphicon glyph="calendar" />
              </InputGroup.Addon>
              <Datetime
                inputProps={{ className: 'form-control input-sm' }}
	    	dateFormat="DD-MM-YYYY" 
                defaultValue={this.state.dttm.replace('T00:00:00','').split('-').reverse().join('-')}
                onFocus={this.setType.bind(this, 'fix')}
                onChange={this.setDatetime.bind(this)}
                timeFormat={false}
              />
            </InputGroup>
          </PopoverSection>
          <div className="clearfix">
            <Button
              bsSize="small"
              className="float-left ok"
              bsStyle="primary"
              onClick={this.close.bind(this)}
            >
              Ok
            </Button>
            <ButtonGroup
              className="float-right"
            >
              <Button
                bsSize="small"
                className="now"
                onClick={this.setValueAndClose.bind(this, 'now')}
              >
               	adesso 
              </Button>
              <Button
                bsSize="small"
                className="clear"
                onClick={this.setValueAndClose.bind(this, '')}
              >
                da inizio 
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Popover>
    );
  }
  render() {
    const value = this.props.value || '';
	  console.log(value.replace('T00:00:00', '').split('-').reverse().join('-'));
    return (
      <div>
        <ControlHeader {...this.props} />
        <OverlayTrigger
          animation={this.props.animation}
          container={document.body}
          trigger="click"
          rootClose
          ref="trigger"
          placement="right"
          overlay={this.renderPopover()}
        >
          <Label style={{ cursor: 'pointer' }}>
            {value.replace('T00:00:00', '').split('-').reverse().join('-') || '∞'}
          </Label>
        </OverlayTrigger>
      </div>
    );
  }
}

DateFilterControl.propTypes = propTypes;
DateFilterControl.defaultProps = defaultProps;
