function previewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("image").files[0]);

    oFReader.onload = function (oFREvent) {
        const filePicker = document.querySelector('.file-picker');
        filePicker.innerHTML = `<img src="${oFREvent.target.result}" alt="Profile Picture" />`
    };
};