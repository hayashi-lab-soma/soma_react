const Config = {
  // ROSBRIDGE_SERVER_IP: "10.80.73.240",
  ROSBRIDGE_SERVER_IP: "10.0.1.119",
  ROSBRIDGE_SERVER_PORT: "9090",
  XARM_ROSBRIDGE_SERVER_IP: "10.0.1.27",
  XARM_ROSBRIDGE_SERVER_PORT: "9090",
  RECONNECTION_TIMER: 3000,
  CMD_VEL_TOPIC: "/cmd_vel",
  MARKER_TOGGLE_TOPIC: "/marker_toggle",
  GOAL_TOPIC: "/react_goal",
  XARM_TOGGLE_TOPIC: "/xarm_toggle",
  ODOM_TOPIC: "/odom",
  POSE_TOPIC: "/amcl_pose",
  // CAMERA_TOPIC: "/camera/rgb/image_raw/compressed",
  CAMERA_TOPIC: "/camera/image/compressed",
  // XARM_CAMERA_TOPIC: "/stereo_inertial_publisher/color/image/compressed",
  XARM_CAMERA_TOPIC: "/detectedImage_decompressed/compressed",
  SONAR_TOPIC: "/sonar",
};

export default Config;
