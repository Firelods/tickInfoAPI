const controller = require("../controllers/event.controller");


module.exports = function (app) {
    app.post(
        "/api/event/create",
        controller.createEvent
    );
    app.post("/api/event/participate", controller.makeUserParticipate);
    app.get("/api/event/getAll", controller.getEvents);
    app.post("/api/student/useInvite", controller.useInvite)
};