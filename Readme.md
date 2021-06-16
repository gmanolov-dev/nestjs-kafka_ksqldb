## Requirements:
Node: v14.16.1

## docker-compose environment

```
# build the images
docker-compose build --force-rm --no-cache
# run the envirnment
docker-compose -p ticker up
```

#### Imortant note 1
You need to wait for 30 seconds, before trying to interact with the system.  
I didn't find the time to check how I could ensure that the kafka is up and running, that's why I set it sleep 30.  

#### Imortant note 2
-p ticker parameter specify the project name  
This way the deploy of the 3 crypto-ticker-listener containers are prefixed with the specified project name.  
If this option is not set then they will be prefixed with the folder name  and it is most likely that the nginx container exit after it starts.  
The configuration of the nginx ./docker-compose/nginx.conf depends on the names of the containers.  

![docker compose diagrame](./docker-compose-diagram.png)   


## Development run
  
### Start Kafka / KSQLDB in docker in case you don't want to install it on your local environment  
cd .local-dev-docker-infrastructure
docker-compose up -d
cd ..
  
  
### Build the common it - is used by the rest of project  
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
npm run start:dev
```


### Build and run crypto-ticker-listener  
```
cd message-listener
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
Wait for 10 seconds.  
Each 10 seconds the values should be updated


#### Confluent Control center web interface  
http://localhost:9021/clusters


### TODOs  
- replace rabbitmq with kafka
- kubernetes - documentation on how to setup kind, install load balancer and all the yaml fils for basic deployment  
- code clean up  
- ...  
   
