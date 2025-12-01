# Stream Engine

🚀 Stream Engine is a Node.js application for displaying a "Starting Soon" screen with background music and a countdown timer, perfect for live streams. It supports multiple music categories, shuffled playlists, and audio visualizations with Aurora and Matrix effects.

---

## 📦 Requirements

- Node.js (v16+ recommended)
- npm (Node Package Manager)

## ⚡ Installation

**Clone the repository:**

```
git clone https://github.com/SoldadoHumano/StreamEngine.git
```

```
cd StreamEngine
```

**Install dependencies:**

```
npm install
```

**Basic folder structure:**

```
StreamEngine/
├── music/
│   ├── Mix/
│   │   ├── track1.mp3
│   │   └── track2.mp3
│   └── AnotherCategory/
│       └── track3.mp3
├── server.js
├── index.html
└── package.json
```

> Each subfolder inside music/ is considered a category. Place your .mp3 files in the desired category folders.

---

## 🚀 Usage

**Start the Node.js server:**

```
node server.js
```

1. Open your browser at http://localhost:3000 to see the "Starting Soon" screen.
2. Click the screen to start the countdown and play the selected music.
3. The audio will be streamed to all connected clients via Socket.IO, allowing integration with overlays or other systems.

---

## ⚙ Configuration

In ```index.html```, you can configure:

```
const CONFIG = {
    countdownMinutes: 1,            // Countdown before the live stream
    initialMusicCategory: "Mix",    // Music category
    matrixFontSize: 14,             // Font size for the Matrix effect
    matrixDropSpeed: 1.5,           // Speed of the falling characters
    matrixFadeSpeed: 0.03,          // Fade speed for Matrix background
    matrixColor: '#00BFFF',         // Matrix effect color
};
```

In ```server.js``` you can adjust the port:

> const PORT = 3000;

---

## 🎵 Features

- Customizable countdown timer
- Multiple music categories support
- Automatically shuffled playlists
- Real-time communication with Socket.IO
- Audio visualizer with Aurora and Matrix animations
- Responsive web interface
- Skip track button 

---

## 🔧 Code Structure

**server.js:** Node.js server using Express and Socket.IO, handles playlists and sends track updates.

**index.html:** Web interface for the "Starting Soon" screen with countdown and music player.

**music/:** Folder where music files are stored, organized by category.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the GNU General Public License v3.0 (GPLv3).
You are free to use, modify, and share it under the terms of the GPLv3.
