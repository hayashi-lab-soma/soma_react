import React, { Component } from "react";
import Config from "../scripts/config";

class XArmCamera extends Component {
    state = {
        ros: null,
    }

    constructor() {
        super();
        this.getCameraImage = this.getCameraImage.bind(this);
    }

    init_connection () {
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () => {
            console.log("camera connection established!");
            this.setState({ connected: true });
        });

        this.state.ros.on("close", () => {
            console.log("camera connection closed!");
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
        } catch(error) {
            console.log("connection problem")
        }
    }

    componentDidMount() {
        this.init_connection();
        this.getCameraImage();
    }

    getCameraImage() {
        var image_subscriber = new window.ROSLIB.Topic({
            ros:this.state.ros,
            name: Config.XARM_CAMERA_TOPIC,
            messageType: "sensor_msgs/CompressedImage",
            // messageType: "sensor_msgs/Image",
        })

        image_subscriber.subscribe((message)=>{
            console.log('Camera Received message on ' + image_subscriber.name);
            document.getElementById('image_sub').src = "data:image/jpg;base64," + message.data;
            });
    }

    render() {
        return (
            <div>
                <h4 className="mt-4">XArm Camera</h4>
            
                <img id="image_sub" 
                    src={require('./placeholder.png')}
                    width="500"
                    height="300">   
                </img>
            </div>

        );
    }
}

export default XArmCamera;