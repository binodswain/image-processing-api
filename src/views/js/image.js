const wrapper = document.getElementById("thumbnail-wrapper");

const fetchThumbnailUrls = async () => {
    const response = await fetch("/api/thumbnails");
    const json = await response.json();

    if (json.length > 0) {
        renderThumbnails(json);
    } else {
        wrapper.innerHTML = "<h3>No thumbnails found</h3>";
    }
};

function renderThumbnails(data) {
    wrapper.innerHTML = "";
    data.forEach((ele) => {
        const {
            filename,
            url,
            meta: { filename: mainfilename, width, height }
        } = ele;

        const divElement = document.createElement("div");
        divElement.classList.add("image");
        divElement.innerHTML = `
            <img src="${url}" class="img" alt="${filename}" width="${width}" height="${height}">
            <p>${filename}</p>
            <table class="metatable">
                <tbody>
                    <tr>
                        <th>Main File</th>
                        <td>${mainfilename}</td>
                    </tr>
                    <tr>
                        <th>Width</th>
                        <td>${width}</td>
                    </tr>
                    <tr>
                        <th>Height</th>
                        <td>${height}</td>
                    </tr>

                </tbody>
            </table>
        `;
        wrapper.appendChild(divElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchThumbnailUrls();
});

// const fetchFullsizeUrls = async () => {
//     const response = await fetch("/api/fullsize-list");
//     const json = await response.json();
//     renderFullsize(json);
// };

// function renderFullsize(data) {
//     return "";
// }
