# vrxp
Virtual Reality Campus


#Docker Commands
```
docker build -t vrxp_img .
```
```
docker image ls
```
```
docker container ls
```
```
#For Windows:

docker run -it --rm -p 8080:8080 -v"$PWD\public":/app/public --name vrxp_container vrxp_image

#For Mac:
docker run -it --rm -p 8080:8080 -v ${PWD}\public:/app/public --name vrxp_con vrxp_img
```
```
docker exec -it vrxp_con /bin/sh
``