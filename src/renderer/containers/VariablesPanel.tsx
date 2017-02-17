import * as React from "react";
import {connect} from "react-redux";
import {ExpansionPanel} from "../components/ExpansionPanel";
import {State, VariableState, ResourceState} from "../state";
import * as assert from "../../common/assert";
import * as actions from "../actions";
import * as selectors from "../selectors";
import {ListBox, ListBoxSelectionMode} from "../components/ListBox";
import {ContentWithDetailsPanel} from "../components/ContentWithDetailsPanel";
import {Card} from "../components/Card";
import {LabelWithType} from "../components/LabelWithType";
import {Button} from "@blueprintjs/core";

interface IVariablesPanelProps {
    dispatch?: any;
    variables: VariableState[];
    selectedResource: ResourceState|null;
    selectedVariableName: string|null;
    selectedVariable: VariableState|null;
    showVariableDetails: boolean;
    showSelectedVariableLayer: boolean;
}

function mapStateToProps(state: State): IVariablesPanelProps {
    return {
        variables: selectors.variablesSelector(state) || [],
        selectedResource: selectors.selectedResourceSelector(state),
        selectedVariableName: selectors.selectedVariableNameSelector(state),
        selectedVariable: selectors.selectedVariableSelector(state),
        showVariableDetails: state.control.showVariableDetails,
        showSelectedVariableLayer: state.session.showSelectedVariableLayer
    }
}

/**
 * The VariablesPanel list all variables of the selected workspace resource.
 *
 * @author Marco Zuehlke, Norman Fomferra
 */
class VariablesPanel extends React.Component<IVariablesPanelProps, null> {
    constructor(props: IVariablesPanelProps) {
        super(props);
        this.handleSelectedVariableName = this.handleSelectedVariableName.bind(this);
        this.handleShowDetailsChanged = this.handleShowDetailsChanged.bind(this);
        this.handleShowSelectedVariableLayer = this.handleShowSelectedVariableLayer.bind(this);
        this.handleAddVariableLayer = this.handleAddVariableLayer.bind(this);
        this.getItemKey = this.getItemKey.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    private handleSelectedVariableName(newSelection: Array<React.Key>) {
        if (newSelection && newSelection.length) {
            this.props.dispatch(actions.setSelectedVariableName(newSelection[0] as string));
        } else {
            this.props.dispatch(actions.setSelectedVariableName(null));
        }
    }

    private handleShowDetailsChanged(value: boolean) {
        this.props.dispatch(actions.setControlProperty('showVariableDetails', value));
    }

    private handleShowSelectedVariableLayer() {
        const showSelectedVariableLayer = this.props.showSelectedVariableLayer;
        this.props.dispatch(actions.setShowSelectedVariableLayer(!showSelectedVariableLayer));
    }

    private handleAddVariableLayer() {
        const resource = this.props.selectedResource;
        const variable = this.props.selectedVariable;
        assert.ok(resource);
        assert.ok(variable && variable.imageLayout);
        this.props.dispatch(actions.addVariableLayer(null, resource, variable));
    }

    render() {
        const variables = this.props.variables;
        if (variables && variables.length) {
            return (
                <ExpansionPanel icon="pt-icon-variable" text="Variables" isExpanded={true} defaultHeight={200}>
                    <ContentWithDetailsPanel showDetails={this.props.showVariableDetails}
                                             onShowDetailsChange={this.handleShowDetailsChanged}
                                             isSplitPanel={true}
                                             initialContentHeight={200}
                                             actionComponent={this.renderVariableActionRow()}>
                        {this.renderVariablesList()}
                        {this.renderVariableDetails()}
                    </ContentWithDetailsPanel>
                </ExpansionPanel>
            );
        } else {
            return (
                <ExpansionPanel icon="pt-icon-variable" text="Variables" isExpanded={true} defaultHeight={200}>
                    <Card>
                        <p><strong>No variables</strong></p>
                        <p>
                            The currently selected resource in the workspace does not contain any variables.
                        </p>
                    </Card>
                </ExpansionPanel>
            );
        }
    }

    private renderVariableActionRow() {
        const selectedVariable = this.props.selectedVariable;
        const isSpatialVariable = selectedVariable && selectedVariable.ndim >= 2 && selectedVariable.imageLayout;
        return (
            <div style={{display: 'flex'}}>
                <span style={{flex: 'auto'}}/>
                <Button disabled={false}
                        iconName={this.props.showSelectedVariableLayer ? "eye-open" : "eye-off"}
                        onClick={this.handleShowSelectedVariableLayer}
                />
                <Button disabled={!isSpatialVariable}
                        iconName="layer"
                        onClick={this.handleAddVariableLayer}
                />
            </div>
        );
    }

    private renderVariableDetails() {
        const selectedVariable = this.props.selectedVariable;
        if (!selectedVariable) {
            return null;
        }
        const entries = [
            <tr key='dataType'>
                <td>Data type</td>
                <td>{selectedVariable.dataType || '-'}</td>
            </tr>,
            <tr key='units'>
                <td>Units</td>
                <td>{selectedVariable.units || '-'}</td>
            </tr>,
            <tr key='ndim'>
                <td>#Dimensions</td>
                <td>{selectedVariable.ndim || '-'}</td>
            </tr>,
            <tr key='shape'>
                <td>Shape</td>
                <td>{selectedVariable.shape ? selectedVariable.shape.join(', ') : '-'}</td>
            </tr>,
            <tr key='chunks'>
                <td>Chunks</td>
                <td>{selectedVariable.chunks ? selectedVariable.chunks.join(', ') : '-'}</td>
            </tr>,
            <tr key='dimensions'>
                <td>Dimensions</td>
                <td>{selectedVariable.dimensions ? selectedVariable.dimensions.join(', ') : '-'}</td>
            </tr>,
            <tr key='valid_min'>
                <td>Valid min.</td>
                <td>{selectedVariable.valid_min || '-'}</td>
            </tr>,
            <tr key='valid_max'>
                <td>Valid max.</td>
                <td>{selectedVariable.valid_max || '-'}</td>
            </tr>,
            <tr key='add_offset'>
                <td>Add offset</td>
                <td>{selectedVariable.add_offset || '-'}</td>
            </tr>,
            <tr key='scale_factor'>
                <td>Scale factor</td>
                <td>{selectedVariable.scale_factor || '-'}</td>
            </tr>,
            <tr key='comment'>
                <td>Comment</td>
                <td>{selectedVariable.comment || '-'}</td>
            </tr>,
        ];
        return (
            <Card>
                <table className="pt-table pt-condensed pt-striped">
                    <tbody>{entries}</tbody>
                </table>
            </Card>
        );
    }

    private getItemKey(itemIndex: number) {
        return this.props.variables[itemIndex].name;
    }

    private renderItem(itemIndex: number) {
        const variable = this.props.variables[itemIndex];
        return <LabelWithType label={variable.name} dataType={variable.dataType}/>;
    }

    private renderVariablesList() {
        const variables = this.props.variables;
        return (
            <ListBox numItems={variables.length}
                     getItemKey={this.getItemKey}
                     renderItem={this.renderItem}
                     selection={this.props.selectedVariableName}
                     selectionMode={ListBoxSelectionMode.SINGLE}
                     onSelection={this.handleSelectedVariableName}/>
        );
    }
}

export default connect(mapStateToProps)(VariablesPanel);
