FROM node:18-alpine

WORKDIR /app

# specify destination only
VOLUME  "/app/data" 

# this will be stored on host machine.
# hwere actually stored(window): \\wsl.localhost\docker-desktop-data\data\docker\volumes
# linux: docker volume ls => mount point
RUN echo "hello volume" > app/data/greeting.txt

RUN npm install -g ganache-cli

ENTRYPOINT [ "ganache-cli", "-h", "0.0.0.0"]

CMD ["--networkId", "777", "--chainId", "888"]

# mount: host dependent. connect host file system to container 
# volume: host independent. fully managed by docker. saved on host machine. data persist regardless of container life cycle