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

const notificationContainer = document.querySelector(".notifications.alerts") as HTMLDivElement;

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
