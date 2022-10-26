import React, { Component } from "react";
import Config from "../scripts/config";

class Map extends Component {
    state = {
        ros: null,
    }

    constructor() {
        super();
        this.view_map = this.view_map.bind(this);
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
                    console.log("connection problem")
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
            console.log("connection problem")
        }
    }

    componentDidMount() {
        this.init_connection();
        this.view_map();
    }

    view_map() {
        var viewer = new window.ROS2D.Viewer({
            divID: "nav_div",
            width: 435,
            height: 326,
        });
        
        var navClient = new window.NAV2D.OccupancyGridClientNav({
            ros: this.state.ros,
            rootObject: viewer.scene,
            viewer: viewer,
            serverName: "/move_base",
            withOrientation: true,
            // image: true,
        });
    }

    render() {
        return <div>
            <div id= "nav_div"></div>
        </div>;
    }
}

export default Map;