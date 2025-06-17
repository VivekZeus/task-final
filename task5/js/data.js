const courseData = [
  {
    courseImage: "images/imageMask.png",
    courseDetails: {
      courseTitle: "Acceleration",
      courseSubject: "Physics",
      courseGrade: "7",
      courseGradeAdditional: "2",
      courseContent: {
        units: "4",
        lessons: "15",
        topics: "24",
      },
      students: "50",
      startDate: "21-jan-2022",
      endDate: "21-Aug-2022",
      isExpired: false,
      classes: [
        " Mr. Frank's Class B",
        " Mr. Frank's Class B",
        " Mr. Frank's Class B",
        " Mr. Frank's Class B",
      ],
    },
  },
  {
    courseImage: "images/imageMask.png",
    courseDetails: {
      courseTitle: "Displacement, Velocity and Speed",
      courseSubject: "Physics 2",
      courseGrade: "6",
      courseGradeAdditional: "3",
      courseContent: {
        units: "2",
        lessons: "15",
        topics: "20",
      },
      students: "50",
      startDate: "21-jan-2022",
      endDate: "21-Aug-2022",
      classes: [],
      isExpired: true,
    },
  },
  {
    courseImage: "images/imageMask.png",
    courseDetails: {
      courseTitle: "Displacement, Velocity and Speed",
      courseSubject: "Physics 2",
      courseGrade: "6",
      courseGradeAdditional: "3",
      courseContent: {
        units: "2",
        lessons: "15",
        topics: "20",
      },
      students: "50",
      startDate: "21-jan-2022",
      endDate: "21-Aug-2022",
      classes: [],
      isExpired: false,
    },
  },
  {
    courseImage: "images/imageMask.png",
    courseDetails: {
      courseTitle: "Displacement, Velocity and Speed",
      courseSubject: "Physics 2",
      courseGrade: "6",
      courseGradeAdditional: "3",
      courseContent: {
        units: "2",
        lessons: "15",
        topics: "20",
      },
      students: "50",
      startDate: "21-jan-2022",
      endDate: "21-Aug-2022",
      classes: [],
      isExpired: true,
    },
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.querySelector(".courses");

  courseData.forEach((course) => {
    const card = document.createElement("div");
    card.className = "courseCard";
    card.innerHTML = `
        ${
          course.courseDetails.isExpired
            ? '<div class="courseTag">EXPIRED</div>'
            : ""
        }
            <div class="courseDetails">
                <div class="courseCardImage">
                    <img src="${course.courseImage}" alt="">
                </div>
                <div class="courseCardDetails">
                    <div class="courseTitle">${course.courseDetails.courseTitle}
                    </div>
                    <div class="courseSubjectGrade">
                        <div class="courseSubject">${
                          course.courseDetails.courseSubject
                        }
                        </div>
                        <div class="textSeparator">|</div>
                        <div class="courseGradeDetails">
                            <div class="courseGrade">${
                              course.courseDetails.courseGrade
                            }</div>
                            <div class="courseGradeAdditional">+${
                              course.courseDetails.courseGradeAdditional
                            }</div>
                        </div>
                    </div>
                    <div class="courseContentDetails">
                        <div class="courseContentDetailsDetails">
                            <div class="courseContentNumber">${
                              course.courseDetails.courseContent.units
                            }</div>
                            <div class="courseContentText">Units</div>
                        </div>
                        <div class="courseContentDetailsDetails">
                            <div class="courseContentNumber">${
                              course.courseDetails.courseContent.lessons
                            }</div>
                            <div class="courseContentText">Lessons</div>
                        </div>
                        <div class="courseContentDetailsDetails">
                            <div class="courseContentNumber">${
                              course.courseDetails.courseContent.topics
                            }</div>
                            <div class="courseContentText">Topics</div>
                        </div>
                    </div>
                    <div class="courseInstructor">
                     <select 
                          class="courseInstructorSelect ${
                            course.courseDetails.classes.length === 0
                              ? "noClassSelect"
                              : ""
                          }" 
                          title="Select Instructor"
                          name="class select"
                          ${
                            course.courseDetails.classes.length === 0
                              ? "disabled"
                              : ""
                          }
                        >
                          ${
                            course.courseDetails.classes.length > 0
                              ? course.courseDetails.classes
                                  .map(
                                    (cls, index) =>
                                      `<option class="classSelectionText classOption-${
                                        index + 1
                                      }" value="${cls}">${cls}</option>`
                                  )
                                  .join("")
                              : `<option class="classSelectionText" value="">No classes</option>`
                          }
                        </select>
                      <img src="images/arrow-down.svg" alt="">
                    </div>
                                        <div class="courseExtraDetails">
                        <div class="courseStudents">
                            <div class="courseStudentsNumber">${
                              course.courseDetails.students
                            }</div>
                            <div>Students</div>
                        </div>
                        <div class="textSeparator">|</div>
                        <div class="courseStartEndDate">${
                          course.courseDetails.startDate
                        } - ${course.courseDetails.endDate}</div>
                    </div>
                </div>
                <div class="courseFavButton">
                <img class="favIcon" src="images/favourite.svg" alt="">
            </div>
            </div>
        <div class="courseButtons">
            <img class="clickOpacityToggle" src="images/preview.svg" alt="">
            <img class="clickOpacityToggle" src="images/manage course.svg" alt="">
            <img class="clickOpacityToggle" src="images/grade submissions.svg" alt="">
            <img class="clickOpacityToggle" src="images/reports.svg" alt="">
        </div>
        `;
    coursesContainer.appendChild(card);
    const favIcon = card.querySelector(".favIcon");
    favIcon.addEventListener("click", () => {
      favIcon.style.opacity = favIcon.style.opacity === "0.5" ? "1" : "0.5";
    });

    const icons = card.querySelectorAll(".clickOpacityToggle");
    icons.forEach((icon) => {
      icon.addEventListener("click", () => {
        icon.style.opacity = icon.style.opacity === "0.5" ? "1" : "0.5";
      });
    });
  });
});
