import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

const {isDocumentNodeSelectedSelector} = selectors.CR.Nodes;

import DimensionSwitcher from './DimensionSwitcher/index';
import EditorToolbar from './EditorToolbar/index';
import LoadingIndicator from './LoadingIndicator/index';

import style from './style.css';

@connect($transform({
    previewUrl: $get('ui.contentCanvas.previewUrl'),
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isEditModePanelHidden: $get('ui.editModePanel.isHidden'),
    isFullScreen: $get('ui.fullScreen.isFullScreen'),
    isDocumentNodeSelected: isDocumentNodeSelectedSelector,
    src: $get('ui.contentCanvas.src')
}), {
    toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class SecondaryToolbar extends Component {
    static propTypes = {
        previewUrl: PropTypes.string,
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isEditModePanelHidden: PropTypes.bool.isRequired,
        isFullScreen: PropTypes.bool.isRequired,
        toggleFullScreen: PropTypes.func.isRequired,
        isDocumentNodeSelected: PropTypes.bool.isRequired,
        src: PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    componentWillUpdate(nextProps) {
        if (this.state.isLoading) {
            this.setState({
                isLoading: false
            });
        } else if (nextProps.src !== this.props.src) {
            this.setState({
                isLoading: true
            });
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        const {
            previewUrl,
            isFringedLeft,
            isFringedRight,
            isEditModePanelHidden,
            isFullScreen,
            toggleFullScreen
        } = this.props;
        const classNames = mergeClassNames({
            [style.secondaryToolbar]: true,
            [style['secondaryToolbar--isFringeLeft']]: isFringedLeft,
            [style['secondaryToolbar--isFringeRight']]: isFringedRight,
            [style['secondaryToolbar--isMovedDown']]: !isEditModePanelHidden,
            [style['secondaryToolbar--isHidden']]: isFullScreen
        });
        const previewButtonClassNames = mergeClassNames({
            [style.secondaryToolbar__buttonLink]: true,
            [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        });

        return (
            <div className={classNames}>
                {this.props.isDocumentNodeSelected ? <DimensionSwitcher/> : <EditorToolbar/>}

                <div className={style.secondaryToolbar__rightHandedActions}>
                    <a
                        href={previewUrl ? previewUrl : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={previewButtonClassNames}
                        >
                        <Icon icon="external-link"/>
                    </a>
                    <IconButton icon="expand" onClick={toggleFullScreen}/>
                </div>
                {this.state.isLoading ? <LoadingIndicator/> : null}
            </div>
        );
    }
}
