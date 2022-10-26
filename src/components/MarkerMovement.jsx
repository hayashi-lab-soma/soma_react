import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../scripts/config";

class MarkerMovement extends Component {
    state = {
        connected: false,
        ros: null,
        isToggleOn:true,
    };

    constructor () {
        super ();
        this.init_connection();
        this.handleClick = this.handleClick.bind(this);
    }

    init_connection () {
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () => {
            console.log("connection established!");
            this.setState({ connected: true });
        });

        this.state.ros.on("close", () => {
            console.log("connection closed!");
            this.setState({ connected: false });

            setTimeout(() => {
                try {
                    this.state.ros.connect(
                        "ws://" + 
                        Config.ROSBRIDGE_SERVER_IP + 
                        ":" + 
                        Config.ROSBRIDGE_SERVER_PORT + ""
                    );
                } catch(error) {
                    console.log(
                        "ws://" + 
                        Config.ROSBRIDGE_SERVER_IP + 
                        ":" + 
                        Config.ROSBRIDGE_SERVER_PORT + ""
                    );
                    console.log("connection problem");
                }
            }, Config.RECONNECTION_TIMER);
        });

        try {
            this.state.ros.connect(
                "ws://" + 
                Config.ROSBRIDGE_SERVER_IP + 
                ":" + 
                Config.ROSBRIDGE_SERVER_PORT + ""
            );
        } catch(error) {
            console.log("connection problem");
        }
    }

    handleClick() {
        this.setState(prevState =>({
            isToggleOn: !prevState.isToggleOn
        }));

        //publish marker_toggle Topic
        var marker_toggle = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.MARKER_TOGGLE_TOPIC,
            messageType: "std_msgs/Bool"
        });
        var bool = new window.ROSLIB.Message({
            data: this.state.isToggleOn
        });
        marker_toggle.publish(bool);

        console.log("published marker_toggle Topic"+ this.state.isToggleOn);
    }

    render() {
        return (
                <Button variant="outline-primary"
                        onClick={this.handleClick}>
                    Home Position
                </Button>
        );
    }
}

export default MarkerMovement;