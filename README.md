# Emotion Palette Generator

Emotion Palette Generator is an interactive web application that accesses the user’s webcam and applies soft colour overlays based on selected moods.  
This first version focuses on webcam access and manual mood selection. Future versions will generate colour palettes automatically and eventually support real emotion detection.

---

## Features

- Live webcam feed using `getUserMedia`
- Mood buttons that apply colour overlays (e.g., Happy, Calm, Sad, Angry)
- Simple and clean UI built with HTML, CSS, and JavaScript
- Automatic camera permission prompt when the page loads

---

## Technologies Used

- HTML  
- CSS  
- JavaScript  
- MediaDevices API (`getUserMedia`)

---

## How to Run the Project

1. Clone or download the repository.  
2. Open the project folder in Visual Studio Code.  
3. Use the **Live Server** extension (or any local server) to open `index.html`.  
   - Webcam access will not work when opening the file directly with `file://`.  
4. Allow camera access when prompted.  
5. Click the mood buttons to apply colour overlays.

---

## Project Structure
```
emotion-palette-generator/
│
├── index.html # Main layout
├── styles.css # Styling and overlay design
├── script.js # Camera and mood logic
└── README.md # Project documentation
```
---

## Future Plans

### Step 2 – Colour Palette Generation
- Generate a colour palette for each mood  
- Display hex values and swatches under the video  
- Smooth transitions between colour changes  

### Step 3 – Automatic Emotion Detection
- Use face-api.js or MediaPipe for facial emotion recognition  
- Map detected emotions to colour overlays and palettes  
- Add confidence indicators  

### Step 4 – Snapshot Feature
- Capture the current webcam frame with the overlay applied  
- Allow saving or downloading snapshots  
- Pair saved images with their generated palettes  

### Step 5 – Mood History
- Store previous snapshots and associated palettes with `localStorage`  
- Display a simple gallery of past moods  

### Step 6 – UI Improvements
- More refined and responsive layout  
- Optional dark mode  
- More mood categories or custom overlays  

---

