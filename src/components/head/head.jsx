import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
    Typography,
    Select,
    FormControl,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Link from '@material-ui/core/Link';
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'
import './head.scss'
import logo from '../../assets/images/home/home_logo.png'
import homeArrow from '../../assets/images/home/home_arrow_bottom.png'

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    appbar: {
        boxShadow: "none",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    alert: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    buttons: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    footer: {
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        width: '100%',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
        }
    },
    footerLinks: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    footerText: {
        cursor: 'pointer',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    languageContainer: {
        paddingLeft: '12px',
        display: 'none'
    },
    selectInput: {
        fontSize: '14px',
        color: colors.pink
    },
    link: {
        textDecoration: 'none'
    }
});

class Footer extends Component {

    constructor(props) {
        super()

        const rewardPools = store.getStore('rewardPools')

        this.state = {
            isLanguage: false,
            rewardPools: rewardPools,
            languages: store.getStore('languages'),
            language: this.switchLanguage(),
            open: true,
            isLanguage: false,
            anchorEl: null,
        }
    }

    switchLanguage = () => {
        switch (i18n.language) {
            case 'zh':
            case 'zh-CN':
                return 'CN'
            case 'en':
                return 'EN'
            default:
                return 'English'
        }
    }

    closeAlert = () => {
        this.setState({ open: false })
    }

    setAnchorEl = anchorEl => [
        this.setState({ anchorEl })
    ]

    handleClick = (event) => {
        this.setAnchorEl(event.currentTarget);
        this.setState({isLanguage: true})
    };

    handleClose = (language) => {
        let self = this
        i18n.changeLanguage(language).then(() => {
            self.setState({ language: self.switchLanguage(language),isLanguage: false })
            self.setAnchorEl(null)
        })
    };


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
        const { open, anchorEl, language,isLanguage } = this.state

        return (
            <div className={`head container-fluid`}>
                <div className="container">
                    <div><Link href="/">
                        <img src={logo} alt="" />
                    </Link></div>
                    <div className="head-select">
                        <img src={homeArrow} />
                        <div className="select-language" onClick={this.handleClick}>{language}</div>
                        {isLanguage?<div className="select-option">
                            <div onClick={this.handleClose.bind(this, 'zh')}>CN</div>
                            <div onClick={this.handleClose.bind(this, 'en')}>EN</div>
                        </div>:<span></span>}
                    </div>
                </div>
            </div>
        )
    }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
