import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../scripts/config";

class XArmPickUp extends Component {
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
                        Config.XARM_ROSBRIDGE_SERVER_IP + 
                        ":" + 
                        Config.XARM_ROSBRIDGE_SERVER_PORT + ""
                    );
                } catch(error) {
                    console.log(
                        "ws://" + 
                        Config.XARM_ROSBRIDGE_SERVER_IP + 
                        ":" + 
                        Config.XARM_ROSBRIDGE_SERVER_PORT + ""
                    );
                    console.log("connection problem");
                }
            }, Config.RECONNECTION_TIMER);
        });

        try {
            this.state.ros.connect(
                "ws://" + 
                Config.XARM_ROSBRIDGE_SERVER_IP + 
                ":" + 
                Config.XARM_ROSBRIDGE_SERVER_PORT + ""
            );
        } catch(error) {
            console.log("connection problem");
        }
    }

    handleClick() {
        this.setState(prevState =>({
            isToggleOn: !prevState.isToggleOn
        }));

        //publish xarm_toggle Topic
        var xarm_toggle = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.XARM_TOGGLE_TOPIC,
            messageType: "std_msgs/Bool"
        });
        var bool = new window.ROSLIB.Message({
            data: this.state.isToggleOn
        });
        xarm_toggle.publish(bool);

        console.log("published xarm_toggle Topic"+ this.state.isToggleOn);
    }

    render() {
        return (
                <Button variant="outline-primary"
                        onClick={this.handleClick}>
                    Pick Up Object
                </Button>
        );
    }
}

export default XArmPickUp;