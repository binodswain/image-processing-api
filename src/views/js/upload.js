let image = null;
// variable for image uploading
let loading = false;

const form = document.getElementById("uploadform");
const imageinput = document.getElementById("image");
const preview = document.getElementById("preview-wrapper");
const successBanner = document.getElementById("success-message");
const errorBanner = document.getElementById("error-message");

const selectImage = (event) => {
    console.log(event.target.files[0]);
    image = event.target.files[0];
    const imageTag = document.createElement("img");
    imageTag.src = URL.createObjectURL(image);
    imageTag.classList.add("preview-img");
    preview.appendChild(imageTag);
};

const uploadImage = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/upload");
    xhr.send(formData);
    xhr.onload = function () {
        console.log(xhr.responseText);
        successBanner.style.display = "block";
        removeImage();
    };
    xhr.onerror = function () {
        console.log("Error");
        successBanner.style.display = "block";
        removeImage();
    };
};

const removeImage = () => {
    preview.innerHTML = "";
    imageinput.value = "";
    image = null;
};

const closeBanner = (event) => {
    // console.log(event.target);
    event.target.parentElement.style.display = "none";
};

form.addEventListener("submit", uploadImage);
form.addEventListener("reset", removeImage);
imageinput.addEventListener("change", selectImage);
Array.from(document.getElementsByClassName("close-btn")).forEach((btn) => {
    btn.addEventListener("click", closeBanner);
});
