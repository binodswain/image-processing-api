const wrapper = document.getElementById("fullimage-wrapper");

const fetchFullsizeUrls = async () => {
    const response = await fetch("/api/images");
    const json = await response.json();

    if (json.length > 0) {
        renderFullsize(json);
    } else {
        wrapper.innerHTML = "<h3>No images found</h3>";
    }
};

function renderFullsize(data) {
    wrapper.innerHTML = "";
    data.forEach((ele) => {
        const { filename, url } = ele;

        const divElement = document.createElement("div");
        divElement.classList.add("image");
        divElement.innerHTML = `
            <img src="${url}" class="img" alt="${filename}">
            <p>${filename}</p>
            </table>
        `;
        wrapper.appendChild(divElement);
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    fetchFullsizeUrls();
});
