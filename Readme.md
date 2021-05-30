## Requirements:
Node: v14.16.1

## docker-compose build

```
# build the images
docker-compose build --force-rm --no-cache crypto-ticker-listener
# run the envirnment
docker-compose -p ticker up
```

![docker compose diagrame](./docker-compose-diagram.png)   

#### Imortant note

-p ticker parameter specify the project name  
This way the deploy of the 3 crypto-ticker-listener containers are prefixed with the specified project name.  
If this option is not set then they will be prefixed with the folder name  and it is most likely that the nginx container exit after it starts.  
The configuration of the nginx ./docker-compose/nginx.conf depends on the names of the containers.  


## Development run
  
### Start Rabbitmq in docker in case you don't want to install it on your local environment  
cd .local-dev-docker-infrastructure
docker-compose up -d
cd ..
  
  
### Build the common it is used by the rest of project  
```
cd common
npm install
npm run build
cd ..
```
  
## Build and run the app  
### you will need to have 3 console opened  
  
### Build and run the coninbase feeder  
```
cd coinbase-feed
npm install
npm run build
npm run start:prod
```


### Build and run crypto-ticker-listener  
```
cd crypto-ticker-listener
npm install
npm run build
npm run start:prod
```

### Start the webapp  
```
cd webapp
npm install
npm start
```
  
  
### Links  
  
#### The webapp  
http://localhost:3000  
Deselect the pairs which you don't want to see  
Clieck on the subscribe  
Wait for 2 seconds.  


#### RAbbitmq web interface  
http://localhost:15672/  
user: guest  
pass: guest  

Go to exchanges  
Select crypto.ticker  



### TODOs  
- complete dockerized environment with nginx layer 7 proxy and 6 listener containers (crypto-ticker-listener)  
- kubernetes - documentation on how to setup kind, install load balancer and all the yaml fils for basic deployment  
- code clean up  
- basic documentaion on the software design and architecure  
- ...  
   