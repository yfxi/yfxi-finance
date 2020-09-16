import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Link from '@material-ui/core/Link';
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'
import './calc.scss'

import Store from "../../stores";
const store = Store.store

class Calc extends Component {

    constructor(props) {
        super()

        const rewardPools = store.getStore('rewardPools')

        this.state = {
            rewardPools: rewardPools,
            open: true,
            anchorEl: null
        }
    }

    renderRewards = () => {
        const { rewardPools } = this.state

        return rewardPools.map((rewardPool, index) => {
            return this.renderRewardPool(rewardPool, index)
        })
    }

    renderRewardPool = (rewardPool, index) => {
        const { classes, t } = this.props

        return (
            <Link href={rewardPool.YieldCalculatorLink} key={rewardPool.id} target="_blank">{`Pool${index + 1}${t('Footer.YieldCalculator')}`}</Link>
        )
    }

    render() {
        const { classes, t, location } = this.props;
        const { open, anchorEl, language } = this.state

        return (
            <div className={`calc`}>
                <div className="container">
                    {this.renderRewards()}</div>
            </div>
        )
    }
}

export default withNamespaces()(withRouter((Calc)));
