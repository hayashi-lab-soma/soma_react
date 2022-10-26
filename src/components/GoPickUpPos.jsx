import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Config from "../scripts/config";

class GoPickUpPos extends Component {
    state = {
        connected: false,
        ros: null,
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
        //publish react_goal Topic
        var marker_toggle = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.GOAL_TOPIC,
            messageType: "std_msgs/String"
        });
        var data = new window.ROSLIB.Message({
            data: "pickup"
        });
        marker_toggle.publish(data);

        console.log("published react_goal Topic");
    }

    render() {
        return (
                <Button variant="outline-primary"
                        onClick={this.handleClick}>
                    Pick Up Position
                </Button>
        );
    }
}

export default GoPickUpPos;