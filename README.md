# Beat Portal

A cross-platform desktop application designed for DJs to organize and manage their music library using advanced metadata analysis and AI-powered music discovery.

## 🎵 Overview

Beat Portal is a powerful music management tool that helps DJs sort and organize their music collection based on metadata parameters. The application operates primarily offline while leveraging online AI capabilities to enhance music metadata when local information is insufficient.

## ✨ Features

- **Offline-First Operation**: Core functionality works without internet connection
- **Metadata Analysis**: Sort music by BPM, key, genre, mood, and other audio characteristics
- **AI-Powered Enhancement**: Uses LLM to search knowledge bases for missing metadata
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Modern UI**: Built with React for a responsive and intuitive interface
- **Fast Backend**: Powered by FastAPI for high-performance metadata processing

## 🏗️ Architecture

### Frontend
- **Framework**: React with TypeScript
- **Desktop Framework**: Tauri (Rust-based)
- **Build Tool**: Vite
- **Styling**: CSS3

### Backend
- **Framework**: FastAPI (Python)
- **AI Integration**: LangChain with OpenAI
- **Audio Processing**: Mutagen for metadata extraction
- **Web Scraping**: BeautifulSoup4 and DuckDuckGo Search
- **Caching**: CacheTools for performance optimization

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.11+
- Rust (for Tauri)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beat-portal
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Create .env file in backend directory
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run tauri dev
   ```

## 📁 Project Structure

```
beat-portal/
├── backend/                 # FastAPI backend
│   ├── .venv/              # Python virtual environment
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
├── frontend/               # React + Tauri frontend
│   ├── src/                # React source code
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React entry point
│   │   └── assets/         # Static assets
│   ├── src-tauri/          # Tauri configuration
│   │   ├── src/            # Rust source code
│   │   ├── Cargo.toml      # Rust dependencies
│   │   └── tauri.conf.json # Tauri configuration
│   ├── package.json        # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # This file
```

## 🔧 Development

### Backend Development

The backend uses FastAPI with the following key dependencies:
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `mutagen`: Audio metadata extraction
- `langchain`: AI/LLM integration
- `beautifulsoup4`: Web scraping
- `duckduckgo-search`: Search capabilities

### Frontend Development

The frontend is built with:
- React 19 with TypeScript
- Tauri for desktop app functionality
- Vite for fast development and building

### Building for Production

1. **Build the frontend**
   ```bash
   cd frontend
   npm run tauri build
   ```

2. **The built application will be in `frontend/src-tauri/target/release/`**

## 🎯 Use Cases

- **Music Library Organization**: Automatically categorize tracks by BPM, key, and genre
- **Set Planning**: Find tracks that match specific criteria for DJ sets
- **Metadata Enhancement**: Use AI to fill in missing track information
- **Offline Music Management**: Work with your music collection without internet dependency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) for the desktop framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://react.dev/) for the frontend framework
- [LangChain](https://langchain.com/) for AI integration
- [Mutagen](https://mutagen.readthedocs.io/) for audio metadata processing

## 📞 Support

For support, email support@beatportal.com or create an issue in this repository.

---

**Beat Portal** - Organize your beats, enhance your sets. 🎧
# beat-portal
