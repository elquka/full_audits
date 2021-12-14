import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaTrash, FaPen, FaPlus, FaPaperPlane } from 'react-icons/fa';


import './category.css';



class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.label,
            editable: this.props.editable,
            value_new: '',
            enable_new: false,
        };
    }

    nuevo_elemento() {
        this.props.newElement(this.props.item, this.state.value_new)
        this.setState({ value_new: '', enable_new: false })
    }

    edita_texto(v) {
        this.setState({ value: v.target.value })
        this.props.changeName(this.props.item, v.target.value)
    }

    borra_elemento() {
        this.props.onDelete(this.props.item)
    }

    render_new() {
        return (
            <Row className='margintop'>
                <Col xs={10}>
                    <Form.Control type="text" placeholder='Ingrese categoria' value={this.state.value_new} onChange={(v) => this.setState({ value_new: v.target.value })} />
                </Col>
                <Col className='alignizq'>
                    <Button variant="primary" size="sm" onClick={() => this.nuevo_elemento()}>
                        <FaPaperPlane />
                    </Button>
                </Col>
            </Row>
        )
    }

    render_button_new() {
        return (
            <Button variant="info" size="sm" onClick={() => { this.setState({ enable_new: true }) }}>
                <FaPlus />
            </Button>
        )
    }

    render() {
        return (
            <>
                <Row>
                    <Col xs={8}>
                        {
                            (this.state.editable) ?
                                <Form.Control type="text" placeholder='Ingrese categoria' value={this.state.value} onChange={(v) => this.edita_texto(v)} /> :
                                <Badge bg="info">({this.props.item.level + 1})- {this.state.value}-({this.props.item.level_up})</Badge>
                        }
                    </Col>
                    <Col className='alignizq'>
                        {
                            (this.props.item.level < 4) ? this.render_button_new() : null
                        }
                        <Button variant="primary" size="sm" onClick={() => { this.setState({ editable: !this.state.editable }) }}>
                            <FaPen />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => this.borra_elemento()}>
                            <FaTrash />
                        </Button>
                    </Col>
                </Row>
                {
                    (this.state.enable_new) ? this.render_new() : null
                }
            </>
        )


    }
}


Category.propTypes = {
    label: PropTypes.string,
    editable: PropTypes.bool,
    onDelete: PropTypes.func,
    changeName: PropTypes.func,
    newElement: PropTypes.func,
    item: PropTypes.object,
};

Category.defaultProps = {
    editable: false,
};

export default Category;