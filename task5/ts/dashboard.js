var courseClassData = {
    courses: 4,
    classes: 3,
};
var notifications = [];
fetch("notifications.json")
    .then(function (resp) {
    if (!resp) {
        throw new Error("Error fetching data..");
    }
    else {
        return resp.json();
    }
}).then(function (data) {
    notifications = data;
}).catch(function (error) {
    console.error("Some error occcurred...");
});
