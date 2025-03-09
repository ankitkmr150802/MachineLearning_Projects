function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select an image!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const resultElement = document.getElementById("result");
    const loadingElement = document.getElementById("loading");
    const uploadedImage = document.getElementById("uploadedImage");

    // ✅ Show "Processing..." message
    loadingElement.style.display = "block";
    resultElement.innerHTML = "";
    uploadedImage.style.display = "none"; // Hide image initially

    fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loadingElement.style.display = "none"; // Hide "Processing..."
        resultElement.innerHTML = `Prediction: ${data.result}`;
        
        // ✅ Display uploaded image from correct path
        uploadedImage.src = `http://localhost:5000${data.img_path}`;
        uploadedImage.style.display = "block"; // Make it visible
    })
    .catch(error => {
        loadingElement.style.display = "none";
        resultElement.innerHTML = "❌ Error predicting!";
        console.error("Error:", error);
    });
}
