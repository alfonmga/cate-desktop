import * as React from 'react';
import {Dialog, Classes, Button, Tooltip} from "@blueprintjs/core";

interface IModalDialogProps {
    isOpen: boolean;
    title?: string;
    confirmIconName?: string;
    confirmTitle?: string;
    confirmTooltip?: string;
    iconName?: string;
    renderBody: () => JSX.Element|JSX.Element[];
    renderActions?: () => JSX.Element[];
    renderExtraActions?: () => JSX.Element[];
    onConfirm: () => void;
    onCancel: () => void;
    canConfirm?: () => boolean;
    noCancelButton?: boolean;
}

type IModalDialogState = any;

export class ModalDialog extends React.Component<IModalDialogProps, IModalDialogState> {

    render() {
        if (!this.props.isOpen) {
            return null;
        }
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={this.props.title}
                iconName={this.props.iconName}
                onClose={this.props.onCancel}
                autoFocus={true}
                canEscapeKeyClose={true}
                canOutsideClickClose={false}
                enforceFocus={true}
            >
                {this.renderDialogContent()}
                {this.renderDialogFooter()}
            </Dialog>
        );
    }

    private renderDialogContent() {
        return (
            <div className={Classes.DIALOG_BODY}>
                {this.props.renderBody()}
            </div>
        );
    }

    private renderDialogFooter() {
        return (
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {this.props.renderActions ? this.props.renderActions() : this.renderActions()}
                </div>
            </div>
        );
    }

    private renderActions() {
        const canConfirm = this.props.canConfirm ? this.props.canConfirm() : true;

        let cancelButton;
        if (!this.props.noCancelButton) {
            cancelButton = (<Button key="cancel"
                                    onClick={this.props.onCancel}>Cancel</Button>);
        }

        let confirmButton = (<Button key="confirm"
                                     onClick={this.props.onConfirm}
                                     className="pt-intent-primary"
                                     disabled={!canConfirm}
                                     iconName={this.props.confirmIconName}>{this.props.confirmTitle || 'OK'}</Button>);

        if (this.props.confirmTooltip) {
            confirmButton = (<Tooltip content={this.props.confirmTooltip} inline>{confirmButton}</Tooltip>);
        }

        let extraActions;
        if (this.props.renderExtraActions) {
            extraActions = this.props.renderExtraActions();
        }

        return extraActions ? [cancelButton, ...extraActions, confirmButton] : [cancelButton, confirmButton];
    }
}
