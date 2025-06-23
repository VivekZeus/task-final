var courseDataList = [];
fetch("data.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    courseDataList = data;
})
    .catch(function (err) { return console.error("Failed to fetch announcements:", err); });
var coursesContainer = document.querySelector(".courses");
courseDataList.forEach(function (course) {
    var card = document.createElement("div");
    card.className = "courseCard";
    card.innerHTML = "\n        ".concat(course.courseDetails.isExpired
        ? '<div class="courseTag">EXPIRED</div>'
        : "", "\n            <div class=\"courseDetails\">\n                <div class=\"courseCardImage\">\n                    <img src=\"").concat(course.courseImage, "\" alt=\"\">\n                </div>\n                <div class=\"courseCardDetails\">\n                    <div class=\"courseTitle\">").concat(course.courseDetails.courseTitle, "\n                    </div>\n                    <div class=\"courseSubjectGrade\">\n                        <div class=\"courseSubject\">").concat(course.courseDetails.courseSubject, "\n                        </div>\n                        <div class=\"textSeparator\">|</div>\n                        <div class=\"courseGradeDetails\">\n                            <div class=\"courseGrade\">").concat(course.courseDetails.courseGrade, "</div>\n                            <div class=\"courseGradeAdditional\">+").concat(course.courseDetails.courseGradeAdditional, "</div>\n                        </div>\n                    </div>\n                    <div class=\"courseContentDetails\">\n                        <div class=\"courseContentDetailsDetails\">\n                            <div class=\"courseContentNumber\">").concat(course.courseDetails.courseContent.units, "</div>\n                            <div class=\"courseContentText\">Units</div>\n                        </div>\n                        <div class=\"courseContentDetailsDetails\">\n                            <div class=\"courseContentNumber\">").concat(course.courseDetails.courseContent.lessons, "</div>\n                            <div class=\"courseContentText\">Lessons</div>\n                        </div>\n                        <div class=\"courseContentDetailsDetails\">\n                            <div class=\"courseContentNumber\">").concat(course.courseDetails.courseContent.topics, "</div>\n                            <div class=\"courseContentText\">Topics</div>\n                        </div>\n                    </div>\n                    <div class=\"courseInstructor\">\n                     <select \n                          class=\"courseInstructorSelect ").concat(course.courseDetails.classes.length === 0
        ? "noClassSelect"
        : "", "\" \n                          title=\"Select Instructor\"\n                          name=\"class select\"\n                          ").concat(course.courseDetails.classes.length === 0
        ? "disabled"
        : "", "\n                        >\n                          ").concat(course.courseDetails.classes.length > 0
        ? course.courseDetails.classes
            .map(function (cls, index) {
            return "<option class=\"classSelectionText classOption-".concat(index + 1, "\" value=\"").concat(cls, "\">").concat(cls, "</option>");
        })
            .join("")
        : "<option class=\"classSelectionText\" value=\"\">No classes</option>", "\n                        </select>\n                      <img src=\"images/arrow-down.svg\" alt=\"\">\n                    </div>\n                                        <div class=\"courseExtraDetails\">\n                        <div class=\"courseStudents\">\n                            <div class=\"courseStudentsNumber\">").concat(course.courseDetails.students, "</div>\n                            <div>Students</div>\n                        </div>\n                        <div class=\"textSeparator\">|</div>\n                          ").concat(course.courseDetails.startDate &&
        course.courseDetails.endDate
        ? "\n      <div class=\"courseStartEndDate\">\n        ".concat(course.courseDetails.startDate, " - ").concat(course.courseDetails.endDate, "\n      </div>\n    ")
        : "", "\n                    </div>\n                </div>\n                <div class=\"courseFavButton\">\n                <img class=\"favIcon\" src=\"images/favourite.svg\" alt=\"\">\n            </div>\n            </div>\n        <div class=\"courseButtons\">\n            <img class=\"clickOpacityToggle\" src=\"images/preview.svg\" alt=\"\">\n            <img class=\"clickOpacityToggle\" src=\"images/manage course.svg\" alt=\"\">\n            <img class=\"clickOpacityToggle\" src=\"images/grade submissions.svg\" alt=\"\">\n            <img class=\"clickOpacityToggle\" src=\"images/reports.svg\" alt=\"\">\n        </div>\n        ");
    coursesContainer.appendChild(card);
    var favIcon = card.querySelector(".favIcon");
    favIcon.addEventListener("click", function () {
        favIcon.style.opacity = favIcon.style.opacity === "0.5" ? "1" : "0.5";
    });
    var icons = card.querySelectorAll(".clickOpacityToggle");
    icons.forEach(function (icon) {
        icon.addEventListener("click", function () {
            icon.style.opacity = icon.style.opacity === "0.5" ? "1" : "0.5";
        });
    });
});
