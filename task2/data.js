
const engagementData = {
replies: 245,
retweets: 142,
likes: '2.6k'
};

const profileData ={
    profilePicLink:"https://th.bing.com/th/id/OIP.IDDYzMQEdOZCaHJxQZm8JgHaHa?w=169&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
    profileUsername:"@moshhamedani",
    profileBio:"I'd love to teach you HTML/CSS!"
}


const profilePic = document.getElementById('profilePic');
profilePic.src = profileData.profilePicLink;
document.getElementById("profileUsername").innerHTML=profileData.profileUsername;
document.getElementById("profileBio").innerHTML=profileData.profileBio;

const engagementElements = document.querySelectorAll('.profileDetailsEngagementValue');

const keys = ['replies', 'retweets', 'likes'];

engagementElements.forEach((el, index) => {
el.textContent = engagementData[keys[index]];
});

