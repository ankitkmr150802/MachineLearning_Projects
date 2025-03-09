function predictPrice() {
    const size = document.getElementById("size").value;
    const bedrooms = document.getElementById("bedrooms").value;
    const bathrooms = document.getElementById("bathrooms").value;
    const garage_space = document.getElementById("garage_space").value;
    const location_score = document.getElementById("location_score").value;
    const resultElement = document.getElementById("result");
    const loadingElement = document.getElementById("loading");

    if (!size || !bedrooms || !bathrooms || !garage_space || !location_score) {
        resultElement.innerHTML = "❌ Please fill all fields!";
        return;
    }

    // Show loading message and clear previous result
    loadingElement.style.display = "block";
    resultElement.innerHTML = "";

    fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, bedrooms, bathrooms, garage_space, location_score }),
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading and show result
        loadingElement.style.display = "none";
        resultElement.innerHTML = `Predicted Price: ${data.predicted_price}`;
    })
    .catch(error => {
        loadingElement.style.display = "none";
        resultElement.innerHTML = "❌ Error predicting price!";
        console.error("Error:", error);
    });
}
