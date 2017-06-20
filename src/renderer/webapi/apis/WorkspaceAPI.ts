import {WebAPIClient} from "../WebAPIClient";
import {JobPromise, JobProgress} from "../Job";
import {WorkspaceState, ImageStatisticsState, OperationKWArgs} from "../../state";

function responseToWorkspace(workspaceResponse: any): WorkspaceState {
    if (!workspaceResponse) {
        return null;
    }
    return {
        baseDir: workspaceResponse.base_dir,
        description: workspaceResponse.description,
        isScratch: workspaceResponse.is_scratch,
        isModified: workspaceResponse.is_modified,
        isSaved: workspaceResponse.is_saved,
        workflow: workspaceResponse.workflow,
        resources: workspaceResponse.resources,
    };
}

export class WorkspaceAPI {
    private webAPIClient: WebAPIClient;

    constructor(webAPI: WebAPIClient) {
        this.webAPIClient = webAPI;
    }

    newWorkspace(baseDir: string | null): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('new_workspace', [baseDir], null, responseToWorkspace);
    }

    openWorkspace(baseDir: string,
                  onProgress: (progress: JobProgress) => void): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('open_workspace', [baseDir], onProgress, responseToWorkspace);
    }

    closeWorkspace(baseDir: string): JobPromise<null> {
        return this.webAPIClient.call('close_workspace', [baseDir]);
    }

    saveWorkspace(baseDir: string): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('save_workspace', [baseDir], null, responseToWorkspace);
    }

    saveWorkspaceAs(baseDir: string, toDir: string,
                    onProgress: (progress: JobProgress) => void): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('save_workspace_as', [baseDir, toDir], onProgress, responseToWorkspace);
    }

    cleanWorkspace(baseDir: string): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('clean_workspace', [baseDir], null, responseToWorkspace);
    }

    setWorkspaceResource(baseDir: string, resName: string, opName: string, opArgs: OperationKWArgs,
                         onProgress: (progress: JobProgress) => void): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('set_workspace_resource', [baseDir, resName, opName, opArgs],
            onProgress, responseToWorkspace);
    }

    renameWorkspaceResource(baseDir: string, resName: string, newResName: string): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('rename_workspace_resource', [baseDir, resName, newResName], null, responseToWorkspace);
    }

    deleteWorkspaceResource(baseDir: string, resName: string): JobPromise<WorkspaceState> {
        return this.webAPIClient.call('delete_workspace_resource', [baseDir, resName], null, responseToWorkspace);
    }

    getWorkspaceVariableStatistics(baseDir: string, resName: string,
                                   varName: string, varIndex: Array<number> | null): JobPromise<ImageStatisticsState> {
        return this.webAPIClient.call('get_workspace_variable_statistics', [baseDir, resName, varName, varIndex]);
    }
}
