import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Config from "../scripts/config";
import * as Three from "three";

class RobotState extends Component {
    state = {
        ros: null,
        x:0,
        y:0,
        z:0,
        orientation:0,
        linear_velocity:0,
        angular_velocity:0,
        sonar_distance:0,
    };

    constructor () {
        super ();
        this.init_connection();
        console.log("constructor robot state")
    }

    init_connection () {
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () => {
            console.log("connection established in Teleoperation Component!");
            console.log(this.state.ros)
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

    componentDidMount(){
        this.getRobotState()
        console.log("componentDidMount robot state")
    }

    getRobotState(){
        var pose_subscriber = new window.ROSLIB.Topic({
            ros:this.state.ros,
            name: Config.POSE_TOPIC,
            messageType: "geometry_msgs/PoseWithCovarianceStamped",
        })

        pose_subscriber.subscribe((message)=>{
            this.setState({ x: message.pose.pose.position.x.toFixed(2)});
            this.setState({ y: message.pose.pose.position.y.toFixed(2)});
            this.setState({ 
                orientation: this.getOrientationfromQuaternion(
                    message.pose.pose.orientation
                    ).toFixed(2),
            })
        })

        var velocity_subscriber = new window.ROSLIB.Topic({
            ros:this.state.ros,
            name: Config.ODOM_TOPIC,
            messageType: "nav_msgs/Odometry",
        })

        velocity_subscriber.subscribe((message)=> {
            this.setState({ linear_velocity: message.twist.twist.linear.x.toFixed(2) });
            this.setState({ angular_velocity: message.twist.twist.angular.z.toFixed(2) });
        })

        var sonar_subscriber = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.SONAR_TOPIC,
            messageType:"sensor_msgs/Range",
        })
        
        sonar_subscriber.subscribe((message)=> {
            this.setState({ sonar_distance: message.range.toFixed(1) })
        })
    }

    getOrientationfromQuaternion(ros_orientation_quaternion) {
        var q = new Three.Quaternion(
            ros_orientation_quaternion.x,
            ros_orientation_quaternion.y,
            ros_orientation_quaternion.z,
            ros_orientation_quaternion.w
        );

        var RPY = new Three.Euler().setFromQuaternion(q);
        
        return RPY["_z"] * (180 / Math.PI);
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <h5 className="mt-4">Position</h5>
                        <p className="pt-0">x: {this.state.x} m</p>
                        <p className="pt-0">y: {this.state.y} m</p>
                        <p className="pt-0">Orientation: {this.state.orientation} deg</p>
                    </Col>
                    <Col>
                        <h5 className="mt-4">Velocities</h5>
                        <p className="mt-0">
                            Linear: {this.state.linear_velocity} m/s
                        </p>
                        <p className="mt-0">
                            Angular: {this.state.angular_velocity} m/s
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 className="mt-1">Sonar</h5>
                        <p className="mt-0">
                            Sonar distance: {this.state.sonar_distance} cm
                        </p>
                    </Col>
                </Row>
            </div>
      
        );
    }
}

export default RobotState;