document.addEventListener("DOMContentLoaded", function () {
  const courseClassData = {
    courses: 4,
    classes: 3,
  };

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

    // Add course option
    const option = document.createElement("option");
    option.value = "course";
    option.textContent = " Select Course";
    courseSelect.appendChild(option);
  });

  classSection.addEventListener("click", function () {
    togglerContainer.style.gridColumn = "2";
    courseClassPageDetails.innerText = `Showing ${courseClassData.classes} of ${courseClassData.classes} classes`;
    courseSelect.innerHTML = "";

    // Add class option
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

      items.forEach(i => i.classList.remove("active"));

      item.classList.add("active");
    });
  });
});
