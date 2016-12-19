import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {ExpansionPanel} from '../components/ExpansionPanel';
import {State, OperationState, WorkspaceState, LayerState} from "../state";
import {setSelectedOperationName, setOperationFilterTags, setOperationFilterExpr} from '../actions'
import {
    Popover, Position, Menu, MenuItem, InputGroup, Classes, Tag, Intent,
    PopoverInteractionKind, Tooltip, Button
} from "@blueprintjs/core";
import FormEvent = React.FormEvent;
import {ListBox, ListBoxSelectionMode} from "../components/ListBox";
import {Card} from "../components/Card";
import {OperationAPI} from "../webapi/apis/OperationAPI";
import * as actions from "../actions";
import {ContentWithDetailsPanel} from "../components/ContentWithDetailsPanel";
import {EditOpStepDialog, IEditOpStepDialogState} from "./EditOpStepDialog";

interface ILayersPanelProps {
    dispatch?: Dispatch<State>;
    webAPIClient: any;
    workspace: WorkspaceState;
    layers: Array<LayerState>;
    selectedLayerId: string|null;
    showLayerDetails: boolean;
}


function mapStateToProps(state: State): ILayersPanelProps {
    return {
        webAPIClient: state.data.appConfig.webAPIClient,
        workspace: state.data.workspace,
        layers: state.data.workspace.layers,
        selectedLayerId: state.control.selectedLayerId,
        showLayerDetails: state.control.showLayerDetails,
    };
}

/**
 * The LayersPanel is used to select and browse available layers.
 *
 * @author Norman Fomferra
 */
class LayersPanel extends React.Component<ILayersPanelProps, any> {

    private handleShowDetailsChanged(value: boolean) {
        this.props.dispatch(actions.setControlState('showLayerDetails', value));
    }

    //noinspection JSMethodCanBeStatic
    private handleAddLayerButtonClicked() {
        console.log('handleAddLayerButtonClicked');
    }

    //noinspection JSMethodCanBeStatic
    private handleRemoveLayerButtonClicked() {
        console.log('handleAddLayerButtonClicked');
    }

    render() {
        const layersList = this.renderLayersList();
        const layerDetailsCard = this.renderOperationDetailsCard();

        const actionComponent = (
            <div style={{display: 'inline', padding: '0.2em'}}>
                <Button className="pt-intent-primary"
                        style={{marginRight: '0.1em'}}
                        onClick={this.handleAddLayerButtonClicked.bind(this)}
                        iconName="add"/>
                <Button className="pt-intent-primary"
                        disabled={!this.getSelectedLayer()}
                        onClick={this.handleRemoveLayerButtonClicked.bind(this)}
                        iconName="remove"/>
            </div>
        );

        return (
            <ExpansionPanel icon="pt-icon-function" text="Layers" isExpanded={true} defaultHeight={300}>
                <ContentWithDetailsPanel showDetails={this.props.showLayerDetails}
                                         onShowDetailsChange={this.handleShowDetailsChanged.bind(this)}
                                         isSplitPanel={true}
                                         initialContentHeight={200}
                                         actionComponent={actionComponent}>
                    {layersList}
                    {layerDetailsCard}
                </ContentWithDetailsPanel>
            </ExpansionPanel>
        );
    }

    private renderLayersList() {
        const layers = this.props.layers;
        if (!layers || !layers.length) {
            return null;
        }

        const selectedLayerId = this.props.selectedLayerId;

        const renderItem = (itemIndex: number) => {
            const layer: LayerState = layers[itemIndex];
            return <span>{layer.name}</span>
        };

        const handleLayerSelection = (oldSelection: Array<React.Key>, newSelection: Array<React.Key>) => {
            if (newSelection.length > 0) {
                this.props.dispatch(actions.setSelectedLayerId(newSelection[0] as string));
            } else {
                this.props.dispatch(actions.setSelectedLayerId(null));
            }
        };

        return (
            <div style={{width: '100%', height: '100%', overflow: 'auto'}}>
                <ListBox numItems={layers.length}
                         getItemKey={index => layers[index].name}
                         renderItem={renderItem}
                         selectionMode={ListBoxSelectionMode.SINGLE}
                         selection={selectedLayerId ? [selectedLayerId] : []}
                         onSelection={handleLayerSelection.bind(this)}/>
            </div>
        );
    }

    //noinspection JSMethodCanBeStatic
    private renderOperationDetailsCard() {
        const layers = this.props.layers;
        if (!layers || !layers.length) {
            return (
                <Card>
                    <p><strong>No layer added.</strong></p>
                    <p>
                        Press the <span className="pt-icon-add"/> button to add a layer.
                    </p>
                </Card>);
        }

        const layer = this.getSelectedLayer();
        if (!layer) {
            return (
                <Card>
                    <p><strong>No layer selected.</strong></p>
                    <p>
                        Select a layer to edit its details.
                    </p>
                </Card>
            );
        }

        return (
            <Card>
                <h5>{layer.name}</h5>
                <p>TODO!</p>
            </Card>
        );
    }

    private getSelectedLayer() {
        const layers = this.props.layers;
        const selectedLayerId = this.props.selectedLayerId;
        return (layers || []).find(layer => layer.id === selectedLayerId);
    }
}

export default connect(mapStateToProps)(LayersPanel);
