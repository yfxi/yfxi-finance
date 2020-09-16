import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import Store from "../../stores";
import '../../assets/css/home.scss'
const store = Store.store
class HomeTemp extends Component {
    constructor(props) {
        super()
        const rewardPools = store.getStore('rewardPools')

        this.state = {
            rewardPools: rewardPools,
            languages: store.getStore('languages'),
            language: this.switchLanguage(),
            open: true,
            anchorEl: null,
            isLanguage: false
        }
    }
    switchLanguage = () => {
        switch (i18n.language) {
            case 'zh':
            case 'zh-CN':
                return 'CN'
            case 'en':
                return 'EN'
            case 'ja':
                return 'JPN'
            case 'th':
                return 'THA'
            default:
                return 'EN'
        }
    }
    setAnchorEl = anchorEl => [
        this.setState({ anchorEl })
    ]

    handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation();
        this.setAnchorEl(event.currentTarget);
        this.setState({ isLanguage: true });
    };

    handleClose = (language) => {
        let self = this
        i18n.changeLanguage(language).then(() => {
            self.setState({ language: self.switchLanguage(language), isLanguage: false })
            self.setAnchorEl(null)
        })
    };
    closeLanguage =  (event) =>{
        this.setState({ isLanguage: false });
    }
    render() {
        // eslint-disable-next-line no-unused-vars
        const { classes, t, location } = this.props;
        const { open, anchorEl, language, isLanguage } = this.state

        return (
            <div className="home" onClick={this.closeLanguage}>
                <div className="home-header container">
                    <div>
                        <img src={require('../../assets/images/home/home_logo.png')} alt="" />
                    </div>
                    <div className="home-language" onClick={this.handleClick}>{language}
                        <img src={require('../../assets/images/home/home_arrow_bottom.png')} alt="" />
                        {isLanguage ?
                            <div>
                                <div onClick={this.handleClose.bind(this, 'zh')}>CN</div>
                                <div onClick={this.handleClose.bind(this, 'en')}>EN</div>
                            </div> : <span></span>
                        }

                    </div>
                </div>
                <div className="home-buttons">
                    <div onClick={() => { this.nav(location.pathname + 'staking') }}>{t('Home.Stake')}
                        <div></div>
                    </div>
                    <div onClick={() => { window.location.href = "http://47.112.190.20:3002/#/" }}>{t('Home.Vault')}
                        <div></div>
                    </div>
                    <div onClick={() => { this.nav(location.pathname + 'vote') }}>{t('Home.Vote')}
                        <div></div>
                    </div>
                </div>
            </div>
        )
    }
    nav = (screen) => {
        this.props.history.push(screen)
    }
}

export default withNamespaces()(withRouter((HomeTemp)));