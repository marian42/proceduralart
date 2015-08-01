# Every Planet Procedural

![Screenshot](https://i.imgur.com/OAnNCrI.png)

This is a simple website that procedurally generates pixelart.
The images show alien planets inspired by the art style of [No Man's Sky](https://www.youtube.com/watch?v=RRpDn5qPp3s).

Go ahead and generate your own pixelart here:
https://marian42.github.io/proceduralart

## Node.js
Besides the website, this repository contains two nodejs files.
One is a simple server that provides a new procedural picture at each page load.
The second script generates an image and saves it to the disk.
This could be used to automatically update wallpapers etc.
Note that the image generation in nodejs is considerably slower than in the browser due to the lack of hardware acceleration.
The nodejs projects need [node-canvas](https://github.com/Automattic/node-canvas).
