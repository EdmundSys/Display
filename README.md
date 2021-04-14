# Display
  Simple Node / Express website packaged with pkg that will loop through images in the public\images folder. It's intended to run on the machine that will run the webpage, but could also be hosted remotely. 
  
  - Config.json
    - server
      - port (int): The port the server will listen on
      - checkImages (int): How often (in ms) the server will check the images folder for changes
      - openbrowser (bool): If true, a browser will be launched on startup
      - browserArg (string): Arguments used in opening the web browser
    - client
      - interval (int): How often (in ms) the image is changed
      - imageFolder (string): not used, but will be used to map image folder to somewhere other than public\images
