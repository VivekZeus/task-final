    document.getElementById('validationForm').addEventListener('submit', function(event) {
      event.preventDefault();
      
      const name = document.getElementById('nameInput');
      const comments = document.getElementById('commentsInput');
      
  
      
    


      if (!name.value.trim() || name.value.trim() == null ||name.value.trim()==" ") {
        alert("Please enter a name...");
        name.focus();
        return;
      }
      

      
      if (!comments.value.trim() || comments.value.trim()==null || comments.value.trim()==" ") {
        alert("Please enter a comment...");
        comments.focus();
        return;
      }

      

    if(!(document.getElementById("genderInputFemale").checked || document.getElementById("genderInputMale").checked)){
        alert("Please select a gender..");
        return;
      }
      
      alert("Form submitted successfully!");

    });