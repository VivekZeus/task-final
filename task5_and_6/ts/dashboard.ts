interface CourseClassData {
  courses: number;
  classes: number;
}

interface Notification {
  message: string;
  date: string;
  ticked: boolean;
}

interface Announcement {
  sender: string;
  message: string;
  date: string;
  ticked: boolean;
  course: boolean;
  noOfFiles: number;
  courseName: string;
}

interface NavbarDropDown {
  subItems: Array<string>;
  title: string;
}

const courseClassData: CourseClassData = {
  courses: 4,
  classes: 3,
};

let notifications: Array<Notification> = [];

let announcements: Array<Announcement> = [];

fetch("announcements.json")
  .then((res) => res.json())
  .then((data: Announcement[]) => {
    announcements = data;
  })
  .catch((err) => console.error("Failed to fetch announcements:", err));

const announcementsContainer = document.querySelector(
  ".notifications.announcements"
) as HTMLDivElement;

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
        <img src="https://cdn3.iconfinder.com/data/icons/ios-edge-glyph-1/25/Attachment-512.png" alt="">
        <span>${
          announcement.noOfFiles > 0
            ? announcement.noOfFiles + " files are attached"
            : "No files attached"
        }</span>
      </div>
      <div class="notificationdateTime">${announcement.date}</div>
    </div>
  `;

  announcementsContainer.appendChild(notifDiv);
});

fetch("notifications.json")
  .then((resp) => {
    if (!resp) {
      throw new Error("Error fetching data..");
    } else {
      return resp.json();
    }
  })
  .then((data: Array<Notification>) => {
    notifications = data;
  })
  .catch((error) => {
    console.error("Some error occcurred...");
  });

const notificationContainer = document.querySelector(
  ".notifications.alerts"
) as HTMLDivElement;

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

const dropdownItems: Array<NavbarDropDown> = [
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

const dropdownMenu = document.querySelector(".dropdown-menu") as HTMLDivElement;

dropdownItems.forEach((item) => {
  const container = document.createElement("div");
  container.className = "navbarItemHamburger";

  container.innerHTML = `
    <div class="item-header-container">
      <div class="item-header">${item.title}</div>
      <img
        class="navbarItemHamburgerImg"
        src="https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Chevron_Up_01-512.png"
        alt=""
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

const navbarItems = document.querySelectorAll(
  ".navbarItem"
) as NodeListOf<HTMLDivElement>;

navbarItems.forEach((item) => {
  item.addEventListener("click", () => {
    navbarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

const courseSection = document.getElementById(
  "courseSection"
) as HTMLDivElement;
const classSection = document.getElementById("classSection") as HTMLDivElement;
const togglerContainer = document.getElementById(
  "togglerContainer"
) as HTMLDivElement;

const courseClassPageDetails = document.getElementById(
  "courseClassPageDetails"
) as HTMLDivElement;

const coursesDiv = document.getElementById("totalCourses") as HTMLDivElement;
const classesDiv = document.getElementById("totalClasses") as HTMLDivElement;
coursesDiv.innerText = courseClassData.courses.toString();
classesDiv.innerText = courseClassData.classes.toString();

const courseSelect = document.getElementById("courseSelect") as HTMLDivElement;

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

const items = document.querySelectorAll(
  ".navbarItem"
) as NodeListOf<HTMLDivElement>;
const toggler = document.getElementById("navbarToggler") as HTMLDivElement;

items.forEach((item, index) => {
  item.addEventListener("click", () => {
    toggler.style.gridColumn = `${index + 1} / span 1`;

    items.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");
  });
});

document.querySelectorAll(".navbarItemHamburger").forEach((item) => {
  const img = item.querySelector(".navbarItemHamburgerImg") as HTMLImageElement;
  const dropdown = item.querySelector(".testClass") as HTMLDivElement;

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
