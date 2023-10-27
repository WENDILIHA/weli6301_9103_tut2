// Variable declarations
var pieces, radius, fft, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#0f0639", "#ff006a", "#ff4f00", "#00f9d9"];  // Array of colors
var uploadLoading = false;  // Flag to check if audio is uploading

// Preload function to load audio file before the sketch runs
function preload() {
    audio = loadSound("audio/DEMO_2.mp3");
}

// Handle uploaded audio file
function uploaded(file) {
    uploadLoading = true;  // Set the uploading flag to true
    uploadedAudio = loadSound(file.data, uploadedAudioPlay);  // Load the uploaded sound file
}

// Play the uploaded audio
function uploadedAudioPlay(audioFile) {
    uploadLoading = false;  // Set the uploading flag to false

    if (audio.isPlaying()) {  // If the current audio is playing, pause it
        audio.pause();
    }

    audio = audioFile;  // Replace the current audio with the uploaded audio
    audio.loop();  // Loop the uploaded audio
}

// Setup function for p5.js
function setup() {
    uploadAnim = select('#uploading-animation');  // Select the uploading animation element

    createCanvas(windowWidth, windowHeight);  // Create a canvas with window dimensions

    toggleBtn = createButton("Play / Pause");  // Create a button to toggle audio play and pause
    toggleBtn.addClass("toggle-btn");  // Add a CSS class to the button
    toggleBtn.mousePressed(toggleAudio);  // Add a mousePressed event to the button

    fft = new p5.FFT();  // Create an FFT object for audio analysis
    audio.loop();  // Loop the default audio

    pieces = 4;  // Default number of pieces or segments
    radius = windowHeight / 4;  // Default radius
}

// Draw function for p5.js to run continuously
function draw() {
    background(colorPalette[0]);  // Set the background color

    fft.analyze();  // Analyze the audio
    var bass = fft.getEnergy("bass");
    var treble = fft.getEnergy(100, 150);
    var mid = fft.getEnergy("mid");

    // Map audio frequencies to various values
    var mapbass = map(bass, 0, 255, -100, 800);
    var scalebass = map(bass, 0, 255, 0.5, 1.2);
    var mapMid = map(mid, 0, 255, -radius / 4, radius * 4);
    var scaleMid = map(mid, 0, 255, 1, 1.5);
    var mapTreble = map(treble, 0, 255, -radius / 4, radius * 4);
    var scaleTreble = map(treble, 0, 255, 1, 1.5);

    // Map mouse coordinates to affect the visualization
    mapMouseX = map(mouseX, 0, width, 2, 0.1);
    mapMouseY = map(mouseY, 0, height, windowHeight / 8, windowHeight / 6);

    pieces = mapMouseX;  // Set the number of pieces or segments based on mouseX
    radius = mapMouseY;  // Set the radius based on mouseY

    // Additional mappings based on mouse position
    var mapScaleX = map(mouseX, 0, width, 1, 0);
    var mapScaleY = map(mouseY, 0, height, 0, 1);

    translate(width / 2, height / 2);  // Translate the origin to the center of canvas

    // Visualization based on audio analysis and mouse position
    for (i = 0; i < pieces; i += 0.01) {
        rotate(TWO_PI / pieces);  // Rotate for each segment

        // Visualization for bass frequencies
        push();
        strokeWeight(1);
        stroke(colorPalette[1]);
        scale(scalebass);
        rotate(frameCount * -0.5);
        line(mapbass, radius / 2, radius, radius);
        line(-mapbass, -radius / 2, radius, radius);
        pop();

        // Visualization for mid frequencies
        push();
        strokeWeight(1);
        stroke(colorPalette[2]);
        line(mapMid, radius, radius * 2, radius * 2);
        pop();

        // Visualization for treble frequencies
        push();
        stroke(colorPalette[3]);
        scale(scaleTreble);
        line(mapTreble, radius / 2, radius, radius);
        pop();
    }
}

// Function to toggle audio play and pause
function toggleAudio() {
    if (audio.isPlaying()) {
        audio.pause();
    } else {
        audio.play();
    }
}

// Handle window resizing event
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);  // Resize canvas based on new window dimensions
}
