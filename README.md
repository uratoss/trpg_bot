# trpg_bot
## About
- パラノイアとかでのDMのやり取りを簡単にする
- あと録音する
## Installation
    git clone https://github.com/NakayamaSatoru/trpg_bot.git 
    cd trpg_bot
    npm install  
## Usage
1. you must edit `config.json` as bellow  

    {
    "discord_token" : "<your bot token>",
    "docomo_token" :"<your docomoTalk token>"
    }
    
1. execute this command  
`node bot.js`
1. enjoy trpg !
## Play recording files
Because Bot record voice at pcm files, you must change files from `.pcm` to `.wav` as bellow.

    sox -r 48000 -c 2 -e signed -b 16 -t raw "input.pcm"  "output.wav"
    
