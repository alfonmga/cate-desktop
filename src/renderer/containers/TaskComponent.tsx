import * as React from "react";
import {TaskState} from "../state";
import {Button, Intent, ProgressBar} from "@blueprintjs/core";
import {JobStatusEnum} from "../webapi/Job";

interface ITaskComponentProps {
    task: TaskState;
    jobId: number;
    onCancelJob(number): void;
    onRemoveJob(number): void;
}

export class TaskComponent extends React.Component<ITaskComponentProps, null> {
    constructor(props: ITaskComponentProps) {
        super(props);
    }

    private static isRunning(tastState: TaskState): boolean {
        return tastState.status === JobStatusEnum.NEW ||
            tastState.status === JobStatusEnum.SUBMITTED ||
            tastState.status === JobStatusEnum.IN_PROGRESS;
    }

    private static isMakingProgress(tastState: TaskState): boolean {
        return tastState.status === JobStatusEnum.IN_PROGRESS &&
            tastState.progress &&
            tastState.progress.worked &&
            tastState.progress.total > 0;
    }

    render() {
        const taskState = this.props.task;
        const jobId = this.props.jobId;

        let activity = null;
        if (TaskComponent.isRunning(taskState)) {
            if (TaskComponent.isMakingProgress(taskState)) {
                // cancel is only possible, if we have a progress monitor
                const progress = <ProgressBar intent={Intent.SUCCESS}
                                              value={taskState.progress.worked / taskState.progress.total}/>;
                const cancelJob = () => this.props.onCancelJob(jobId);
                const cancelButton = <Button type="button"
                                             className="pt-intent-primary"
                                             onClick={cancelJob}
                                             iconName="pt-icon-cross">Cancel</Button>;

                const cancelableProgress = <div style={{display: "flex", flexFlow: "row nowrap", width: "100%"}}>
                    <div style={{
                        flex: "3 1 auto",
                        display: "flex",
                        flexFlow: "column",
                        justifyContent: "center",
                        padding: "1px 1px 1px 1px"
                    }}>{progress}</div>
                    <div style={{flex: "0 1 auto"}}>{cancelButton}</div>
                </div>;

                let progressMag = null;
                if (taskState.progress && taskState.progress.message) {
                    progressMag = <div style={{fontSize: '0.8em'}}>{taskState.progress.message}</div>;
                }
                activity = <div>{cancelableProgress}{progressMag}</div>
            } else {
                activity = <ProgressBar/>
            }
        }
        let errorMsg = null;
        if (taskState.failure && taskState.failure.message) {
            const removeJob = () => this.props.onRemoveJob(jobId);
            errorMsg = <div style={{display: "flex", flexFlow: "row nowrap", width: "100%"}}>
                <div className="pt-intent-danger" style={{
                    flex: "0 1 auto",
                    color: 'rgb(255, 0, 0)',
                    fontSize: '0.8em'
                }}>{taskState.failure.message}</div>
                <div style={{flex: "10 1 auto"}}/>
                <Button style={{flex: "0 1 auto"}} iconName="cross" onClick={removeJob}/>
            </div>;
        }
        const title = taskState.title || `Task #${jobId}`;
        return (<div>{title}{activity}{errorMsg}</div>);
    };
}
