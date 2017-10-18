This project was done with colelagues during the Microsoft Hackathon :

Theme  - Containerizing Minecraft using "Docker and Kubernetes"

# openhack2017
for Azure commands , look up here :

* https://docs.microsoft.com/en-us/cli/azure/acs/kubernetes?view=azure-cli-latest#az_acs_kubernetes_get_credentials

* Kubernetes commands on azure (On azure shell):

To install kubectl 

```
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/darwin/amd64/kubectl
```
Making kubectl binary executable:

```
chmod +x ./kubectl
```

Move binary to to your PATH

```
sudo mv ./kubectl /usr/local/bin/kubectl
```

Install with brew for Mac only:

```
brew install kubectl
```

Checking the version of kubectl :

```
kubectl version
```

Creating the cube config file:

```
mkdir kube/config
```

* On Terminal :

Adding config file for kubernetes:

```
code ~/.kube/config
```

Which version of kubectl you are using :

```
kubectl version
```

For information on running clusters :

```
kubectl cluster-info
```

To identify where the server is rendered :

```
kubectl proxy
```

Where is my K8s rendered:

```
check the kubernetes UI here: http://localhost:8001/ui ( or any other port/IP where its running)
```