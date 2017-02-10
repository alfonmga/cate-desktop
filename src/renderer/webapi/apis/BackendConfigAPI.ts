import {WebAPIClient} from "../WebAPIClient";
import {JobPromise} from "../Job";
import {BackendConfigState} from "../../state";


function fromPythonConfig(configResponse: any): BackendConfigState|null {
    if (!configResponse) {
        return null;
    }
    return {
        dataStoresPath: configResponse.data_stores_path,
        useWorkspaceImageryCache: configResponse.use_workspace_imagery_cache,
    };
}

function toPythonConfig(backendConfig: BackendConfigState): any {
    if (!backendConfig) {
        return {};
    }
    return {
        data_stores_path: backendConfig.dataStoresPath,
        use_workspace_imagery_cache: backendConfig.useWorkspaceImageryCache,
    };
}

export class BackendConfigAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    getBackendConfig(): JobPromise<BackendConfigState> {
        return this.webAPIClient.call('get_config', [], null, fromPythonConfig);
    }

    setBackendConfig(config: BackendConfigState): JobPromise<null> {
        return this.webAPIClient.call('set_config', [toPythonConfig(config)]);
    }
}
