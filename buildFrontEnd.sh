cd client
ng build --optimization=true --aot=true --build-optimizer=true --configuration=production --output-hashing none &&
docker build -t $1 .