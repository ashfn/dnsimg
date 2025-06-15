ffmpeg -i input.webp -vf "scale=1024:1024,scale=1024:1024" output.jpg
xxd -p output.jpg > output.txt