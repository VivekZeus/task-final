var courseClassData = {
    courses: 4,
    classes: 3,
};
var notifications = [];
var announcements = [];
fetch("announcements.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    announcements = data;
})
    .catch(function (err) { return console.error("Failed to fetch announcements:", err); });
var announcementsContainer = document.querySelector(".notifications.announcements");
announcements.forEach(function (announcement) {
    var notifDiv = document.createElement("div");
    notifDiv.classList.add("notificationDetails");
    if (!announcement.ticked) {
        notifDiv.style.background = "#FFFFEE";
    }
    notifDiv.innerHTML = "\n    <div class=\"notificationSenderStatus\">\n      <div class=\"sender\">\n        <div style=\"color: #6E6E6E;\n        font-size:14px;\n        \">PA :</div>\n        <div class=\"senderName\">".concat(announcement.sender, "</div>\n      </div>\n      <div class=\"status\">\n        <img src=\"").concat(announcement.ticked
        ? "images/tick-green.png"
        : "images/minus-green-1.png", "\" alt=\"status\">\n      </div>\n    </div>\n    <div class=\"notificationMessage\">\n      ").concat(announcement.message, "\n    </div>\n ").concat(announcement.courseName
        ? "\n    <div class=\"notificationCourseInfo\">\n      Course : ".concat(announcement.courseName, "\n    </div>")
        : "", "\n    <div class=\"notificationOtherDetails\">\n      <div class=\"notificationFiles\">\n        <img src=\"https://cdn3.iconfinder.com/data/icons/ios-edge-glyph-1/25/Attachment-512.png\" alt=\"\">\n        <span>").concat(announcement.noOfFiles > 0
        ? announcement.noOfFiles + " files are attached"
        : "No files attached", "</span>\n      </div>\n      <div class=\"notificationdateTime\">").concat(announcement.date, "</div>\n    </div>\n  ");
    announcementsContainer.appendChild(notifDiv);
});
fetch("notifications.json")
    .then(function (resp) {
    if (!resp) {
        throw new Error("Error fetching data..");
    }
    else {
        return resp.json();
    }
})
    .then(function (data) {
    notifications = data;
})
    .catch(function (error) {
    console.error("Some error occcurred...");
});
var notificationContainer = document.querySelector(".notifications.alerts");
notifications.forEach(function (notif) {
    var notifDiv = document.createElement("div");
    notifDiv.classList.add("notificationDetails");
    if (!notif.ticked) {
        notifDiv.style.background = "#FFFFEE";
    }
    notifDiv.innerHTML = "\n    <div class=\"alertStatus\">\n      <div>".concat(notif.message, "</div>\n      <div class=\"status\">\n        <img src=\"").concat(notif.ticked ? "images/tick-green.png" : "images/minus-green-1.png", "\" alt=\"status\">\n      </div>\n    </div>\n    <div class=\"alertOtherDetails\">\n      <div class=\"notificationdateAlertTime\">").concat(notif.date, "</div>\n    </div>\n  ");
    notificationContainer.appendChild(notifDiv);
});
var dropdownItems = [
    {
        title: "DASHBOARD",
        subItems: ["Dashboard Overview", "Statistics"],
    },
    {
        title: "CONTENT",
        subItems: ["Courses", "Modules"],
    },
    {
        title: "USERS",
        subItems: [],
    },
    {
        title: "REPORTS",
        subItems: ["Attendance", "Grades"],
    },
    {
        title: "ADMIN",
        subItems: [],
    },
];
var dropdownMenu = document.querySelector(".dropdown-menu");
dropdownItems.forEach(function (item) {
    var container = document.createElement("div");
    container.className = "navbarItemHamburger";
    container.innerHTML = "\n    <div class=\"item-header-container\">\n      <div class=\"item-header\">".concat(item.title, "</div>\n      <img\n        class=\"navbarItemHamburgerImg\"\n        src=\"https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Chevron_Up_01-512.png\"\n        alt=\"\"\n      />\n    </div>\n    ").concat(item.subItems.length > 0
        ? "\n      <div class=\"testClass\">\n        ".concat(item.subItems.map(function (sub) { return "<div>".concat(sub, "</div>"); }).join(""), "\n      </div>\n    ")
        : "", "\n  ");
    dropdownMenu.appendChild(container);
});
var navbarItems = document.querySelectorAll(".navbarItem");
navbarItems.forEach(function (item) {
    item.addEventListener("click", function () {
        navbarItems.forEach(function (i) { return i.classList.remove("active"); });
        item.classList.add("active");
    });
});
var courseSection = document.getElementById("courseSection");
var classSection = document.getElementById("classSection");
var togglerContainer = document.getElementById("togglerContainer");
var courseClassPageDetails = document.getElementById("courseClassPageDetails");
var coursesDiv = document.getElementById("totalCourses");
var classesDiv = document.getElementById("totalClasses");
coursesDiv.innerText = courseClassData.courses.toString();
classesDiv.innerText = courseClassData.classes.toString();
var courseSelect = document.getElementById("courseSelect");
courseSection.addEventListener("click", function () {
    togglerContainer.style.gridColumn = "1";
    courseClassPageDetails.innerText = "Showing ".concat(courseClassData.courses, " of ").concat(courseClassData.courses, " courses");
    courseSelect.innerHTML = "";
    var option = document.createElement("option");
    option.value = "course";
    option.textContent = " Select Course";
    courseSelect.appendChild(option);
});
classSection.addEventListener("click", function () {
    togglerContainer.style.gridColumn = "2";
    courseClassPageDetails.innerText = "Showing ".concat(courseClassData.classes, " of ").concat(courseClassData.classes, " classes");
    courseSelect.innerHTML = "";
    var option = document.createElement("option");
    option.value = "class";
    option.textContent = "Select Class";
    courseSelect.appendChild(option);
});
var items = document.querySelectorAll(".navbarItem");
var toggler = document.getElementById("navbarToggler");
items.forEach(function (item, index) {
    item.addEventListener("click", function () {
        toggler.style.gridColumn = "".concat(index + 1, " / span 1");
        items.forEach(function (i) { return i.classList.remove("active"); });
        item.classList.add("active");
    });
});
document.querySelectorAll(".navbarItemHamburger").forEach(function (item) {
    var img = item.querySelector(".navbarItemHamburgerImg");
    var dropdown = item.querySelector(".testClass");
    item.addEventListener("click", function () {
        if (!dropdown)
            return;
        img.classList.toggle("rotate");
        dropdown.classList.toggle("show");
    });
    if (dropdown) {
        dropdown.addEventListener("mouseleave", function () {
            dropdown.classList.remove("show");
            img.classList.remove("rotate");
        });
    }
});
