import React from 'react';
import './components.css';

export class CheckBox extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <label><input type="checkbox" checked={this.props.checked} ref="check_input" onClick={() => this.props.handleClick(this.props.id, this.refs.check_input.checked)} />
                    {this.props.name}
                </label>
            </div>
        );
    }
}

export class Modal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>

                <div className="modal-main">
                    <div className="modal-header">
                        <span style={{left:'50%',marginRight:"-7%"}}>{this.props.title}</span>
                        <button className="modal-circle-close" onClick={() => this.props.handleClose()}>+</button>
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

