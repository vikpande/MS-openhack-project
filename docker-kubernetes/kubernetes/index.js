const Api = require('kubernetes-client');

const getClusterConfig = () => {
    if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT) {
        return Object.assign({}, Api.config.getInCluster(), { promises: true });
    }
    if (process.env.KUBERNETES_HOST) {
        return {
            url: process.env.KUBERNETES_HOST,
            namespace: process.env.KUBERNETES_NAMESPACE || 'default',
            promises: true
        }
    }
    return Object.assign({}, Api.config.fromKubeconfig(), { promises: true });
};
const config = getClusterConfig();

exports = module.exports = {
    core: new Api.Core(config),
    apps: new Api.Apps(config),
    extensions: new Api.Extensions(config)
}