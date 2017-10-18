const kubernetes = require('./kubernetes');
const core = kubernetes.core;
const extensions = kubernetes.extensions;
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json())

app.get('/', async (req, res) => {
    var ns = await core.namespaces.get();
    var tenantNames = ns.items.filter((item) => item.metadata.name.startsWith('mc-')).map(item => item.metadata.name);
    var tenants = await Promise.all(tenantNames.map(async name => {
        var service = await core.namespaces(name).services.get('minecraft');
        var pod = await core.namespaces(name).pods.get({ qs: { labelSelector: 'app=minecraft' }});
        var ip = service.status.loadBalancer.ingress ? service.status.loadBalancer.ingress[0].ip : 'n/a';
        return {
            name: name.substring(3),
            endpoints: {
                minecraft: `${ip}:25565`,
                rcon: `${ip}:25575`
            },
            telemetry: {}
        };
    }));
    res.send(JSON.stringify(tenants));
})

app.post('/', async (req, res) => {
    var name = req.body.name;
    // Create namespace
    var ns = await core.namespaces.post({ body: {
        metadata: {  name: 'mc-' + name }
    } });
    // Create pvc persistentvolumeclaims
    /*var pvc = await core.namespaces(ns.metadata.name).persistentvolumeclaims.post({ body: {
        metadata: { name: 'minecraft-data', labels: { app: 'minecraft' } },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: { requests: { storage: '5Gi' } }
        }
    }});*/
    // Create service
    var service = await core.namespaces(ns.metadata.name).services.post({ body: {
        metadata: { name: 'minecraft', labels: { app: 'minecraft' } },
        spec: {
            type: 'LoadBalancer',
            ports: [
                { port: 25565, name: 'game' },
                { port: 25575, name: 'rcon' }
            ],
            selector: { app: 'minecraft' }
        }
    }});
    // Create deployment
    var deployment = await extensions.namespaces(ns.metadata.name).deployments.post({ body: {
        metadata: { name: 'minecraft', labels: { app: 'minecraft' } },
        spec: {
            replicas: 1,
            selector: { matchLabels: { app: 'minecraft' } },
            template: {
                metadata: { name: 'minecraft', labels: { app: 'minecraft' } },
                spec: {
                    //volumes: [ { name: 'data', persistentVolumeClaim: { claimName: 'minecraft-data' } } ],
                    containers: [
                        {
                            image: 'openhack/minecraft-server:1.0',
                            name: 'minecraft',
                            //volumeMounts: [ { mountPath: '/data', name: 'data' } ],
                            env: [ { name: 'EULA', value: 'TRUE' } ],
                            ports: [
                                { containerPort: 25565 },
                                { containerPort: 25575 },
                            ]
                        }
                    ]
                }
            },
            
        }
    }});
    res.status(201);
    res.send( { name: name });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})