import React, { Component } from "react";
import Container from 'react-bootstrap/Container';

class Footer extends Component {
    state = {}
    render() {
        return (
            <Container className='text-center'>
                <p className="mt-4">HayashiLab@KyushuInstituteofTechnology &copy; 2022</p>
            </Container>
        );
    }
}

export default Footer;
