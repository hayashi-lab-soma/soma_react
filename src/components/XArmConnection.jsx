import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import Config from "../scripts/config";

class XArmConnection extends Component {
    state = {
        connected: false,
        ros: null
    };

    constructor () {
        super ();
        this.init_connection();
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
                    console.log("connection problem")
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
            console.log("xarm established"+Config.XARM_ROSBRIDGE_SERVER_IP);
        } catch(error) {
            console.log("connection problem")
            console.log("xarm unestablished"+Config.XARM_ROSBRIDGE_SERVER_IP);
        }
    }

    render() {
        return (
            <div>
                <Alert
                variant={this.state.connected? "success" : "danger"}>
                    {this.state.connected? "Xarm Connected": "XArm Disconnected"}
                </Alert>
            </div>
        );
    }
  
}

export default XArmConnection;
