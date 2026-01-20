Interactive 3D Art Exhibition

Academic Project – Web-Based 3D Visualization

# 1. Project Overview

&emsp;&emsp;&emsp;&emsp;This project is an interactive 3D Art Exhibition implemented as a web application using Three.js and bundled with Vite.
    The application allows users to freely explore a virtual gallery, interact with artworks, and view contextual descriptions rendered as a user interface overlay.

&emsp;&emsp;&emsp;&emsp;All 3D assets were created in Blender and exported using the GLTF/GLB format.
    The project demonstrates practical usage of real-time 3D rendering, camera control systems, raycasting, and asset management in a modern web environment.

# 2. Objectives


* The primary objectives of this project are:

* To design and implement a real-time 3D environment in the browser

* To explore camera navigation constraints in virtual spaces

* To implement object interaction using raycasting

* To separate visual rendering logic from user interface logic

* To manage large binary assets using Git LFS

* To follow modern frontend development practices using Vite

# 3. Key Features

* Interactive 3D gallery rendered in real time

* Multiple camera operation modes:

* Gallery mode – constrained movement within gallery boundaries

* Free camera mode – unrestricted movement

* Locked camera mode – no user input (cinematic / presentation use)

* Artwork interaction using raycasting

* Dynamic display of artwork metadata (title, author, description)

* Post-processing effects (Black & White, Sepia)

* Runtime configuration panel (lil-gui)

* Optional background audio

# 4. Technologies Used
| Category              | Technology                |
| -------------         |:-------------:            |
| 3D Rendering          | Three.js                  |
| Build Tool            | Vite                      |
| Programming Language  | JavaScript (ES Modules)   |
| 3D Asset Creation     | Blender                   |
| Asset Format          | GLTF / GLB                |
| Version Control       | Git + Git LFS             |



# 5. System Requirements

To run the project locally, the following software is required:

* Node.js (version 18 or newer recommended)

* Git

* Git Large File Storage (LFS)

# 6. Installation Instructions

  6.1 Repository Setup  

&emsp;&emsp;&emsp;git clone https://github.com/KruczyM/3D-project-art-exhibition
&emsp;&emsp;&emsp;cd gallery  

  6.2 Git LFS Configuration (Required)

&emsp;&emsp;    This project contains large binary assets (3D models and HDR environments) managed via Git LFS.   
&emsp;&emsp;    If you haven't got "git lfs" installed:  
&emsp;&emsp;    on Mac:   
&emsp;&emsp;&emsp;&emsp;    brew install git-lfs  / port install git-lfs  
&emsp;&emsp;&emsp;&emsp;    git lfs install  
&emsp;&emsp;    on Linux:    
&emsp;&emsp;&emsp;&emsp;    sudo apt-get install git-lfs  
&emsp;&emsp;&emsp;&emsp;    git lfs install  
&emsp;&emsp;    on Windows:    
&emsp;&emsp;&emsp;&emsp;    git lfs install  
&emsp;&emsp;    then:     
&emsp;&emsp;&emsp;&emsp;    git lfs pull


&emsp;&emsp;Failure to install Git LFS will result in missing or corrupted 3D assets.

6.3 Dependency Installation  
&emsp;&emsp;&emsp;&emsp;npm install

6.4 Running the Development Server  
&emsp;&emsp;&emsp;&emsp;npm run dev

6.5 If you have live server extension installed, you can run the project directly from the editor.

&emsp;&emsp;The application will be available at:

&emsp;&emsp;&emsp;&emsp;http://localhost:5173

# 8. Project Structure
gallery/  
├── public/                  # Static assets (audio, HDR/EXR files, GLB models)  
├── src/  
│   ├── main.js              # Main Three.js scene setup  
│   ├── arts.js              # Artwork metadata and camera transitions  
│   ├── audioManager.js      # Audio configuration  
│   └── styles.css  
├── index.html  
├── package.json  
├── vite.config.js  
└── README.md  

# 9. Interaction and Controls

* Mouse / Touch Input

* Rotate and zoom camera (depending on active camera mode)

* Keyboard Input / Arrow keys to navigate between artworks

* Graphical User Interface

* Camera mode selection

* Post-processing effects control

* Exposure and color adjustments

