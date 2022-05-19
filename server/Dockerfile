FROM node:16
RUN apt-get update && \
      apt-get -y install sudo
RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo
RUN mkdir -p /home/docker && chown -R docker:docker /home/docker
USER docker
RUN /bin/bash
WORKDIR /WANTED-BOT
COPY . /WANTED-BOT/
RUN sudo apt install chromium
RUN npm install -f

CMD npm run start:dev