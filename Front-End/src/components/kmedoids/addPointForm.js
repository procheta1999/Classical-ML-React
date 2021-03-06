import React, {Component} from 'react';
import {Form, Input, Button} from 'semantic-ui-react';
import {PROXY_URL} from '../misc/proxyURL';
import './addPointForm.css';


function validNumber(str) {
    let trimmed = str.trim();
    return trimmed.length > 0 && isFinite(trimmed);
};

export async function getMetadata(points, k, metric) {
    const x = [];
    const y = [];
    points.map(point => {
        x.push(point.x);
        y.push(point.y);
    });
    
    const response = await fetch(PROXY_URL + '/kmedoids', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'x': x,
            'y': y,
            'k': k,
            'metric': metric
        })
    });

    const metadata = await response.json();
    return metadata;
}

export class AddPointForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: '',
            y: '',
            label: null,
            xStatus: '',
            yStatus: '',
            onNewPoint: this.props.onNewPoint,
            updateData: this.props.updateData,
            points: this.props.points
        };
    };

    async componentDidUpdate(prevProps) {
        if (prevProps.points.length !== this.props.points.length
            || prevProps.k !== this.props.k
            || prevProps.metric !== this.props.metric) {
            this.setState({
                points: this.props.points
            });

            const promise = getMetadata(this.props.points, this.props.k, this.props.metric);
            promise.then(newData => this.state.updateData(newData));
        }
    };

    render() {
        return (
            <div className='kmedoids__form'>
                <h2><u>Input Point</u>:</h2>
                <Form className='xy-form'>
                    <header className="xy-form__row">
                        <Form.Field>
                            <Input  className="xy-form__row__input"
                                    placeholder='X-Coordinate'
                                    value={this.state.x}
                                    onChange={e => {
                                        this.setState({x: e.target.value});
                                        if (validNumber(e.target.value) || e.target.value.length === 0)
                                            this.setState({xStatus: ''});
                                        else
                                            this.setState({xStatus: 'Not a number!'});
                                    }}
                            />
                            <span className='xy-form__row__span'>{this.state.xStatus}</span>
                        </Form.Field>
                    </header>
                    <header className="xy-form__row">
                        <Form.Field>
                            <Input  className="xy-form__row__input"
                                    placeholder='Y-Coordinate'
                                    value={this.state.y}
                                    onChange={e => {
                                        this.setState({y: e.target.value});
                                        if (validNumber(e.target.value) || e.target.value.length === 0)
                                            this.setState({yStatus: ''});
                                        else
                                            this.setState({yStatus: 'Not a number!'});
                                    }}
                            />
                            <span className="xy-form__row__span">{this.state.yStatus}</span>
                        </Form.Field>
                    </header>
                    <Button primary
                            className="add-point"
                            disabled={!(validNumber(this.state.x) && validNumber(this.state.y))}
                            onClick={async () => {
                                let newPoint = {
                                    x: Number(this.state.x), 
                                    y: Number(this.state.y),
                                    label: Number(this.state.label)
                                }
                                this.state.onNewPoint(newPoint);
                                this.setState({
                                    x: '',
                                    y: '',
                                    xStatus: '',
                                    yStatus: ''
                                });
                            }
                    }>
                        Add Point
                    </Button>
                </Form>
            </div>
        );
    }
};