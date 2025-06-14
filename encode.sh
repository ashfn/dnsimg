ffmpeg -i input.png -vf "scale=500:500,scale=640:640" -q:v 1 output.jpg
xxd -p output.jpg > output.txt