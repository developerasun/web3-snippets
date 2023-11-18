#!/bin/bash

initSwarm() {
    local MANAGER_IP=$1
    docker swarm init --advertise-addr "${MANAGER_IP}"
}

viewNode() {
    docker node ls
}

joinNode() {
    docker swarm join-token worker
}

initRegistry() {
    docker service create --name registry --publish published=5000,target=5000 registry:2
}

deployService() {
    docker service create --replica 1 --name $1
}

viewService() {
    docker service ls
}

inspectService() {
    local serviceId = "${1}"
    docker service inspect --pretty "${serviceId}"
}

scaleService() {
    local serviceName = "${1}"
    docker service scale ${serviceName}=5 # scale by creation of 5 replications
}

removeService() {
    local serviceName = "${1}"
    docker service rm "${serviceName}"
}

echo "${1}"
initSwarm