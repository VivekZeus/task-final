document.addEventListener("DOMContentLoaded", function () {
  const courseClassData = {
    courses: 4,
    classes: 3,
  };

  const notifications = [
    {
      message:
        "License for Introduction to Algebra has been assigned to your school",
      date: "June 18, 2025 10:00 AM",
      ticked: true,
    },
    {
      message: "Reminder: Complete your course enrollment",
      date: "June 17, 2025 2:30 PM",
      ticked: false,
    },
    {
      message: "New assignment uploaded for Math",
      date: "June 16, 2025 5:15 PM",
      ticked: true,
    },
  ];

  const notificationContainer = document.querySelector(".notifications.alerts");

  notifications.forEach((notif) => {
    const notifDiv = document.createElement("div");
    notifDiv.classList.add("notificationDetails");

    if (!notif.ticked) {
      notifDiv.style.background = "#FFFFEE";
    }

    notifDiv.innerHTML = `
    <div class="alertStatus">
      <div>${notif.message}</div>
      <div class="status">
        <img src="${
          notif.ticked ? "images/tick-green.png" : "images/minus-green-1.png"
        }" alt="status">
      </div>
    </div>
    <div class="alertOtherDetails">
      <div class="notificationdateAlertTime">${notif.date}</div>
    </div>
  `;

    notificationContainer.appendChild(notifDiv);
  });

  const announcements = [
    {
      sender: "PA",
      message: "Please attend the meeting at 3 PM today.",
      noOffiles: 2,
      date: "June 18, 2025 11:30 AM",
      ticked: true,
      course: false,
    },
    {
      sender: "Admin",
      message: "New policy document has been uploaded.",
      noOffiles: 0,
      date: "June 17, 2025 4:00 PM",
      ticked: false,
      courseName: "Mathematics 101",
      course: true,
    },
    {
      sender: "PA",
      message: "Don't forget to submit your project report.",
      noOffiles: 4,
      date: "June 16, 2025 9:15 AM",
      ticked: false,
      courseName: "Mathematics 101",
      course: true,
    },
  ];

  const announcementsContainer = document.querySelector(
    ".notifications.announcements"
  );

  announcements.forEach((announcement) => {
    const notifDiv = document.createElement("div");
    notifDiv.classList.add("notificationDetails");

    if (!announcement.ticked) {
      notifDiv.style.background = "#FFFFEE";
    }

    notifDiv.innerHTML = `
    <div class="notificationSenderStatus">
      <div class="sender">
        <div style="color: #6E6E6E;
        font-size:14px;
        ">PA :</div>
        <div class="senderName">${announcement.sender}</div>
      </div>
      <div class="status">
        <img src="${
          announcement.ticked
            ? "images/tick-green.png"
            : "images/minus-green-1.png"
        }" alt="status">
      </div>
    </div>
    <div class="notificationMessage">
      ${announcement.message}
    </div>
 ${
   announcement.courseName
     ? `
    <div class="notificationCourseInfo">
      Course : ${announcement.courseName}
    </div>`
     : ""
 }
    <div class="notificationOtherDetails">
      <div class="notificationFiles">
        <img src="../images/attachment.png" alt="">
        <span>${
          announcement.noOffiles > 0
            ? announcement.noOffiles + " files are attached"
            : "No files attached"
        }</span>
      </div>
      <div class="notificationdateTime">${announcement.date}</div>
    </div>
  `;

    announcementsContainer.appendChild(notifDiv);
  });

  const dropdownItems = [
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

  const dropdownMenu = document.querySelector(".dropdown-menu");

  dropdownItems.forEach((item) => {
    const container = document.createElement("div");
    container.className = "navbarItemHamburger";

    container.innerHTML = `
    <div class="item-header-container">
      <div class="item-header">${item.title}</div>
      <img
        class="navbarItemHamburgerImg"
        src="../images/chevron.png"
        alt="chevronDropDownImg"
      />
    </div>
    ${
      item.subItems.length > 0
        ? `
      <div class="testClass">
        ${item.subItems.map((sub) => `<div>${sub}</div>`).join("")}
      </div>
    `
        : ""
    }
  `;

    dropdownMenu.appendChild(container);
  });

  const navbarItems = document.querySelectorAll(".navbarItem");

  navbarItems.forEach((item) => {
    item.addEventListener("click", () => {
      navbarItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  const courseSection = document.getElementById("courseSection");
  const classSection = document.getElementById("classSection");
  const togglerContainer = document.getElementById("togglerContainer");

  const courseClassPageDetails = document.getElementById(
    "courseClassPageDetails"
  );

  const coursesDiv = document.getElementById("totalCourses");
  const classesDiv = document.getElementById("totalClasses");
  coursesDiv.innerText = courseClassData.courses;
  classesDiv.innerText = courseClassData.classes;

  const courseSelect = document.getElementById("courseSelect");

  courseSection.addEventListener("click", function () {
    togglerContainer.style.gridColumn = "1";
    courseClassPageDetails.innerText = `Showing ${courseClassData.courses} of ${courseClassData.courses} courses`;

    courseSelect.innerHTML = "";

    const option = document.createElement("option");
    option.value = "course";
    option.textContent = " Select Course";
    courseSelect.appendChild(option);
  });

  classSection.addEventListener("click", function () {
    togglerContainer.style.gridColumn = "2";
    courseClassPageDetails.innerText = `Showing ${courseClassData.classes} of ${courseClassData.classes} classes`;
    courseSelect.innerHTML = "";

    const option = document.createElement("option");
    option.value = "class";
    option.textContent = "Select Class";
    courseSelect.appendChild(option);
  });

  const items = document.querySelectorAll(".navbarItem");
  const toggler = document.getElementById("navbarToggler");

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      toggler.style.gridColumn = `${index + 1} / span 1`;

      items.forEach((i) => i.classList.remove("active"));

      item.classList.add("active");
    });
  });


document.querySelectorAll(".navbarItemHamburger").forEach((item) => {
  const img = item.querySelector(".navbarItemHamburgerImg");
  const dropdown = item.querySelector(".testClass");

  item.addEventListener("click", () => {
    if (!dropdown) return;

    img.classList.toggle("rotate");
    dropdown.classList.toggle("show");
  });

  if (dropdown) {
    dropdown.addEventListener("mouseleave", () => {
      dropdown.classList.remove("show");
      img.classList.remove("rotate");
    });
  }
});


});

