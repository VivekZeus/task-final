interface CourseData {
  courseImage: string;
  courseDetails: {
    courseTitle: string;
    courseSubject: string;
    courseGrade: string;
    courseGradeAdditional: string;
    courseContent: {
      units: string;
      lessons: string;
      topics: string;
    };
    students: string;
    startDate: string;
    endDate: string;
    isExpired: boolean;
    classes: string[];
  };
}

let courseDataList:Array<CourseData>=[]

fetch("data.json")
  .then((res) => res.json())
  .then((data: CourseData[]) => {
    courseDataList = data;
  })
  .catch((err) => console.error("Failed to fetch announcements:", err));

const coursesContainer = document.querySelector(".courses") as HTMLDivElement;

courseDataList.forEach((course) => {
  const card = document.createElement("div") as HTMLDivElement;
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
                          ${
                            course.courseDetails.startDate &&
                            course.courseDetails.endDate
                              ? `
      <div class="courseStartEndDate">
        ${course.courseDetails.startDate} - ${course.courseDetails.endDate}
      </div>
    `
                              : ""
                          }
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
  const favIcon = card.querySelector(".favIcon") as HTMLImageElement;
  favIcon.addEventListener("click", () => {
    favIcon.style.opacity = favIcon.style.opacity === "0.5" ? "1" : "0.5";
  });

  const icons = card.querySelectorAll(
    ".clickOpacityToggle"
  ) as NodeListOf<HTMLImageElement>;
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.style.opacity = icon.style.opacity === "0.5" ? "1" : "0.5";
    });
  });
});
