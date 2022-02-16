load('api_config.js');
load('api_gpio.js');
load('api_rpc.js');

let MOTOR_PIN_STEP = 14;
let MOTOR_PIN_ENABLE = 2;
let MOTOR_PIN_DIR = 12;

let MOTOR_PIN_ENABLE_ENABLED = 0;
let MOTOR_PIN_ENABLE_DISABLED = 1;

let initializeMotorPins = function () {
    GPIO.set_mode(MOTOR_PIN_STEP, GPIO.MODE_OUTPUT);
    GPIO.set_mode(MOTOR_PIN_ENABLE, GPIO.MODE_OUTPUT);
    GPIO.set_mode(MOTOR_PIN_DIR, GPIO.MODE_OUTPUT);

    GPIO.write(MOTOR_PIN_ENABLE, MOTOR_PIN_ENABLE_DISABLED);
};

let motorStep = function () {
    GPIO.write(MOTOR_PIN_STEP, 1);
    GPIO.write(MOTOR_PIN_STEP, 0);
};

let motorMove = function (steps, dir) {
    GPIO.write(MOTOR_PIN_ENABLE, MOTOR_PIN_ENABLE_ENABLED);
    GPIO.write(MOTOR_PIN_DIR, dir);

    for (let i = 0; i < steps; i++) {
        motorStep();
    }

    GPIO.write(MOTOR_PIN_ENABLE, MOTOR_PIN_ENABLE_DISABLED);
};

initializeMotorPins();

let getStepsOffset = function () {
    return Cfg.get("rollerblinds.settings.stepsOffset");
};

let setStepsOffset = function (stepsOffset) {
    return Cfg.set({"rollerblinds.settings.stepsOffset": stepsOffset}, true);
};

let getStepsPerMovement = function () {
    return Cfg.get("rollerblinds.settings.stepsPerMovement") || 0;
};

let openBlinds = function () {
    let stepsPerMovement = getStepsPerMovement();

    motorMove(
        stepsPerMovement - getStepsOffset(),
        Cfg.get("rollerblinds.settings.inverseRotation")
    );

    setStepsOffset(stepsPerMovement);
};

let closeBlinds = function () {
    motorMove(
        getStepsOffset(),
        !Cfg.get("rollerblinds.settings.inverseRotation")
    );

    setStepsOffset(0);
};

let setStepsOffsetZero = function () {
    setStepsOffset(0);
};

RPC.addHandler('Blinds.Open', openBlinds);
RPC.addHandler('Blinds.Close', closeBlinds);
RPC.addHandler('Blinds.SetPositionAsZero', setStepsOffsetZero);





